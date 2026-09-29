import { useState, useEffect } from 'preact/hooks';
import { supabase } from '../lib/supabase';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    whatsapp_number: '',
    telegram_handle: '',
    tiktok_handle: '',
    site_name: 'Romlex Digital'
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (data) setSettings(data);
    }
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const { error } = await supabase.from('settings').update({
      whatsapp_number: settings.whatsapp_number,
      telegram_handle: settings.telegram_handle,
      tiktok_handle: settings.tiktok_handle,
      site_name: settings.site_name,
      updated_at: new Date().toISOString()
    }).eq('id', 1);

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert('Save failed: ' + error.message);
    }
  }

  return (
    <div class="bg-card border border-border rounded-2xl p-6">
      <h2 class="text-xl font-bold text-text mb-6">
        <i class="fa-solid fa-gear text-accent mr-2"></i> Store Settings
      </h2>

      <form onSubmit={handleSave} class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-muted mb-2">Store Name</label>
          <input
            type="text"
            value={settings.site_name || ''}
            onInput={e => setSettings({...settings, site_name: e.target.value})}
            class="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text focus:border-accent focus:outline-none"
            placeholder="Romlex Digital"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-muted mb-2">
            <i class="fa-brands fa-whatsapp text-accent mr-2"></i> WhatsApp Number
          </label>
          <input
            type="text"
            value={settings.whatsapp_number || ''}
            onInput={e => setSettings({...settings, whatsapp_number: e.target.value})}
            class="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text focus:border-accent focus:outline-none"
            placeholder="2348012345678"
          />
          <p class="text-xs text-muted mt-1">Include country code (e.g., 234 for Nigeria)</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-muted mb-2">
            <i class="fa-brands fa-telegram text-accent mr-2"></i> Telegram Handle
          </label>
          <input
            type="text"
            value={settings.telegram_handle || ''}
            onInput={e => setSettings({...settings, telegram_handle: e.target.value})}
            class="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text focus:border-accent focus:outline-none"
            placeholder="RomlexDigital"
          />
          <p class="text-xs text-muted mt-1">Without the @ symbol</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-muted mb-2">
            <i class="fa-brands fa-tiktok text-accent mr-2"></i> TikTok Handle
          </label>
          <input
            type="text"
            value={settings.tiktok_handle || ''}
            onInput={e => setSettings({...settings, tiktok_handle: e.target.value})}
            class="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text focus:border-accent focus:outline-none"
            placeholder="romlexdigital"
          />
          <p class="text-xs text-muted mt-1">Without the @ symbol</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          class="w-full py-3 bg-accent text-[#051a16] rounded-xl font-bold hover:bg-accent-dim transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}