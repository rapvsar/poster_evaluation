/*
 * Supabase-backed shared storage for the poster evaluation platform.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * script.js talks to an async `window.storage` object (get / set / list).
 * On plain GitHub Pages that object doesn't exist, so the app falls back to
 * localStorage — which means every juror's scores are trapped on their own
 * phone and the organizer dashboard can't aggregate across devices.
 *
 * This file defines `window.storage` on top of a tiny Supabase key/value
 * table, so all jurors write to one shared online database and the dashboard
 * sees everything. It must load AFTER the supabase-js CDN script and BEFORE
 * script.js (see index.html).
 *
 * SETUP: paste your project URL and publishable key below.
 * Both are safe to expose in the browser — access is controlled by the
 * row-level-security policies you create in Supabase (see README / SQL).
 * (The "publishable" key is Supabase's browser-safe key; do NOT use the
 * "secret" key here.)
 */

const SUPABASE_URL = 'https://rgmdkcqdphiaadpiqqnt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_DQvdFAbF4e0ifEkwf-vHIA_2dfarkk8';

(function () {
  if (typeof supabase === 'undefined' || !supabase.createClient) {
    console.error('supabase-js failed to load — check the CDN <script> tag in index.html. Falling back to localStorage.');
    return; // window.storage stays undefined -> script.js uses localStorage
  }
  if (SUPABASE_URL.startsWith('PASTE_') || SUPABASE_ANON_KEY.startsWith('PASTE_')) {
    console.error('Supabase not configured yet — edit assets/js/supabase-config.js. Falling back to localStorage.');
    return;
  }

  const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const TABLE = 'kv';

  // The app passes a trailing `true` argument to each call; we ignore extras.
  window.storage = {
    // Returns { value: "<json string>" } or null, matching what script.js expects.
    async get(key) {
      const { data, error } = await sb.from(TABLE).select('value').eq('key', key).maybeSingle();
      if (error) throw error;
      return data ? { value: data.value } : null;
    },
    // Upsert so re-scoring the same poster overwrites cleanly.
    async set(key, value) {
      const { error } = await sb.from(TABLE)
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      if (error) throw error;
      return true;
    },
    // Returns { keys: [...] } for every row whose key starts with `prefix`.
    async list(prefix) {
      const { data, error } = await sb.from(TABLE).select('key').like('key', prefix + '%');
      if (error) throw error;
      return { keys: (data || []).map(r => r.key) };
    },
    // Wipe every jury submission (keys "jury:*") — used by the organizer
    // "Clear all results" button to reset the platform for a new event.
    // The uploaded candidate roster (key "candidates") is deliberately kept.
    async clearAll() {
      const { error } = await sb.from(TABLE).delete().like('key', 'jury:%');
      if (error) throw error;
      return true;
    }
  };
})();
