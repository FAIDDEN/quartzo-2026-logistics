import { useState } from 'react'
import { Truck, Plus, Trash2, MessageCircle, Edit3, Save, X } from 'lucide-react'
import { useStore } from '../store'
import { useI18n } from '../i18n'

export default function Drivers() {
  const { drivers, addDriver, updateDriver, deleteDriver, currentUser, lang } = useStore(s => ({
    drivers: s.drivers, addDriver: s.addDriver,
    updateDriver: s.updateDriver, deleteDriver: s.deleteDriver,
    currentUser: s.currentUser, lang: s.lang,
  }))
  const { t } = useI18n(lang)
  const isAdmin = currentUser?.role === 'admin'

  const [showForm, setShowForm] = useState(false)
  const [editId,   setEditId]   = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', phone2: '', vehicle: '', plate: '', notes: '' })

  function resetForm() { setForm({ name: '', phone: '', phone2: '', vehicle: '', plate: '', notes: '' }); setShowForm(false); setEditId(null) }

  function handleSave() {
    if (!form.name.trim()) return
    if (editId) {
      updateDriver(editId, form)
    } else {
      addDriver(form)
    }
    resetForm()
  }

  function startEdit(d) {
    setForm({ name: d.name||'', phone: d.phone||'', phone2: d.phone2||'', vehicle: d.vehicle||'', plate: d.plate||'', notes: d.notes||'' })
    setEditId(d.id)
    setShowForm(true)
  }

  return (
    <div className="p-5 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-lg tracking-widest text-earth-cream">{t('drivers')}</h1>
          <p className="text-xs text-earth-stone">{(drivers||[]).length} {lang === 'pt' ? 'motoristas' : 'drivers'}</p>
        </div>
        {isAdmin && (
          <button onClick={() => { resetForm(); setShowForm(!showForm) }} className="btn-primary flex items-center gap-1.5 text-xs py-1.5 px-3">
            {showForm ? <X size={13} /> : <Plus size={13} />}
            {showForm ? t('cancel') : t('addDriver')}
          </button>
        )}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="bg-q-850 border border-q-750 rounded-xl p-4 animate-fade-in">
          <h3 className="text-xs font-medium text-earth-cream mb-3">{editId ? (lang === 'pt' ? 'Editar Motorista' : 'Edit Driver') : t('addDriver')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ['name', t('driverName'), 'text', 'João Silva'],
              ['phone', t('driverPhone'), 'tel', '(61) 99999-0000'],
              ['phone2', `${t('driverPhone')} 2`, 'tel', '(61) 99999-1111'],
              ['vehicle', t('driverVehicle'), 'text', 'Hilux'],
              ['plate', t('driverPlate'), 'text', 'ABC-1234'],
            ].map(([field, label, type, ph]) => (
              <div key={field}>
                <label className="label">{label}</label>
                <input type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={ph} className="input text-xs mt-1 w-full" />
              </div>
            ))}
            <div className="col-span-full">
              <label className="label">{lang === 'pt' ? 'Observações' : 'Notes'}</label>
              <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder={lang === 'pt' ? 'Ex: disponível 03-05/06, trecho BSB-Chapada' : 'E.g. available Jun 3-5, BSB-Chapada route'}
                className="input text-xs mt-1 w-full" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="btn-primary flex items-center gap-1.5 text-xs py-1.5 px-4">
              <Save size={13} />{t('save')}
            </button>
            <button onClick={resetForm} className="text-xs text-earth-stone hover:text-earth-cream px-3 py-1.5 bg-q-800 rounded-lg">{t('cancel')}</button>
          </div>
        </div>
      )}

      {/* Drivers grid */}
      {(drivers||[]).length === 0 ? (
        <div className="text-center py-16 text-earth-stone">
          <Truck size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">{t('noDrivers')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {(drivers||[]).map(d => (
            <div key={d.id} className="card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-q-700 flex items-center justify-center text-q-300">
                    <Truck size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-earth-cream">{d.name}</div>
                    {d.vehicle && <div className="text-[10px] text-earth-stone">{d.vehicle}{d.plate && ` · ${d.plate}`}</div>}
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(d)} className="p-1 text-earth-stone hover:text-earth-cream"><Edit3 size={12} /></button>
                    <button onClick={() => deleteDriver(d.id)} className="p-1 text-earth-stone hover:text-earth-terra"><Trash2 size={12} /></button>
                  </div>
                )}
              </div>

              {/* Phones */}
              <div className="space-y-1">
                {d.phone && (
                  <a href={`https://wa.me/55${d.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-[11px] text-earth-sage hover:text-earth-sage/80">
                    <MessageCircle size={10} />{d.phone}
                  </a>
                )}
                {d.phone2 && (
                  <a href={`https://wa.me/55${d.phone2.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-[11px] text-earth-sage hover:text-earth-sage/80">
                    <MessageCircle size={10} />{d.phone2}
                  </a>
                )}
              </div>

              {d.notes && <p className="text-[10px] text-earth-stone mt-2 border-t border-q-800 pt-2">{d.notes}</p>}
              {d.modifiedInApp && <div className="text-[9px] text-q-400 mt-1">✎ editado</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
