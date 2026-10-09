import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, FileText, Headphones, Video, Layers, Plus, Search, CheckCircle2, RefreshCw } from 'lucide-react';
import { ClassroomMaterial } from '../types';
import { INITIAL_MATERIALS, ENGLISH_LEVELS } from '../data/curriculumData';
import { fetchClassroomCourses, ClassroomCourse } from '../services/googleClassroom';

interface ClassroomHubProps {
  activeRole: 'student' | 'teacher';
}

export const ClassroomHub: React.FC<ClassroomHubProps> = ({ activeRole }) => {
  const [materials, setMaterials] = useState<ClassroomMaterial[]>(() => {
    try {
      const saved = localStorage.getItem('cokito_classroom_materials');
      if (!saved) return INITIAL_MATERIALS;

      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed)) return INITIAL_MATERIALS;

      const storedMaterials = parsed.filter((item): item is ClassroomMaterial =>
        !!item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.levelId === 'string' &&
        typeof item.url === 'string'
      );
      const storedIds = new Set(storedMaterials.map(material => material.id));
      return [
        ...storedMaterials,
        ...INITIAL_MATERIALS.filter(material => !storedIds.has(material.id))
      ];
    } catch {
      return INITIAL_MATERIALS;
    }
  });
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Super Goal' | 'Mega Goal'>('All');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Google Classroom Live Courses state
  const [liveCourses, setLiveCourses] = useState<ClassroomCourse[]>([]);
  const [isLoadingLiveCourses, setIsLoadingLiveCourses] = useState(false);
  const [liveCourseError, setLiveCourseError] = useState<string | null>(null);

  // New material modal for Teacher
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLevelId, setNewLevelId] = useState('level_1');
  const [newUnit, setNewUnit] = useState(1);
  const [newType, setNewType] = useState<'pdf' | 'audio' | 'video' | 'quiz' | 'slides'>('pdf');
  const [newUrl, setNewUrl] = useState('');

  // Fetch live courses on mount
  useEffect(() => {
    loadLiveCourses();
  }, []);

  // Keep teacher-added Hub materials across refreshes in this browser.
  // This is local persistence only; it does not imply cross-device/cloud sync.
  useEffect(() => {
    try {
      localStorage.setItem('cokito_classroom_materials', JSON.stringify(materials));
    } catch (error) {
      console.warn('Could not persist Classroom Hub materials', error);
    }
  }, [materials]);

  const loadLiveCourses = async () => {
    setIsLoadingLiveCourses(true);
    setLiveCourseError(null);
    const result = await fetchClassroomCourses();
    if (result.error) {
      if (result.error !== 'NO_AUTH') {
        setLiveCourseError(result.error);
      }
    } else {
      setLiveCourses(result.courses);
    }
    setIsLoadingLiveCourses(false);
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const level = ENGLISH_LEVELS.find(l => l.id === newLevelId) || ENGLISH_LEVELS[0];
    const created: ClassroomMaterial = {
      id: `mat_${Date.now()}`,
      levelId: newLevelId,
      levelTitle: `${level.levelName} - ${level.book}`,
      unit: Number(newUnit),
      title: newTitle,
      description: newDesc,
      type: newType,
      url: newUrl || 'https://classroom.google.com/',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setMaterials(prev => [created, ...prev]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewUrl('');
  };

  // Filtered materials
  const filteredMaterials = materials.filter(m => {
    const level = ENGLISH_LEVELS.find(l => l.id === m.levelId);
    if (selectedCategory !== 'All' && level?.category !== selectedCategory) return false;
    if (selectedLevelFilter !== 'All' && m.levelId !== selectedLevelFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Google Classroom Hub
            </span>
            <span className="text-xs text-blue-200">Materiales Permanentes y Estructurados</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Recursos y Guías de Estudio por Nivel
          </h2>
          <p className="text-sm text-blue-100 max-w-xl">
            Accede a las guías oficiales de Super Goal (Niveles I-VI) y Mega Goal (Niveles VII-XII), pistas de audio, diapositivas y hojas de ejercicios organizadas por unidad.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <a
            href="https://classroom.google.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-blue-800 rounded-2xl font-bold text-xs sm:text-sm shadow-md hover:bg-blue-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Abrir Google Classroom</span>
          </a>
          {activeRole === 'teacher' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-900/60 hover:bg-blue-900 text-white border border-white/20 rounded-2xl font-semibold text-xs sm:text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Subir Material</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Google Classroom Courses (if authenticated) */}
      {liveCourses.length > 0 && (
        <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Clases en Vivo Detectadas en tu Google Classroom:</h3>
            </div>
            <button
              onClick={loadLiveCourses}
              disabled={isLoadingLiveCourses}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-800"
              title="Actualizar clases de Google Classroom"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingLiveCourses ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {liveCourses.map(course => (
              <a
                key={course.id}
                href={course.alternateLink || 'https://classroom.google.com/'}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-blue-50/60 border border-blue-100 hover:border-blue-300 rounded-xl block text-xs transition-colors"
              >
                <strong className="text-slate-900 block truncate">{course.name}</strong>
                <span className="text-slate-500 truncate block">{course.section || 'Clase activa'}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto">
          {(['All', 'Super Goal', 'Mega Goal'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedLevelFilter('All');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'All' ? 'Todos los Programas' : cat}
            </button>
          ))}
        </div>

        {/* Level Dropdown & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedLevelFilter}
            onChange={e => setSelectedLevelFilter(e.target.value)}
            className="p-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 font-medium"
          >
            <option value="All">Todos los niveles</option>
            {ENGLISH_LEVELS.filter(l => selectedCategory === 'All' || l.category === selectedCategory).map(lvl => (
              <option key={lvl.id} value={lvl.id}>
                {lvl.levelName}: {lvl.book}
              </option>
            ))}
          </select>

          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar unidad o tema..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map(mat => {
          return (
            <div
              key={mat.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {mat.levelTitle} • U{mat.unit}
                  </span>
                  <span className="text-xs text-slate-400">
                    {mat.type.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-start gap-3 my-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    {mat.type === 'pdf' && <FileText className="w-5 h-5" />}
                    {mat.type === 'audio' && <Headphones className="w-5 h-5" />}
                    {mat.type === 'slides' && <Layers className="w-5 h-5" />}
                    {mat.type === 'video' && <Video className="w-5 h-5" />}
                    {mat.type === 'quiz' && <BookOpen className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{mat.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mat.description}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Actualizado {mat.updatedAt}</span>
                <a
                  href={mat.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
                >
                  <span>Abrir Material</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Teacher: Upload Material Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Añadir Material a Classroom (Profe Ana)</h3>
            <form onSubmit={handleAddMaterial} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nivel del Material</label>
                <select
                  value={newLevelId}
                  onChange={e => setNewLevelId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                >
                  {ENGLISH_LEVELS.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.levelName}: {l.book} ({l.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unidad</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={newUnit}
                    onChange={e => setNewUnit(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Recurso</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="pdf">PDF / Hoja de Trabajo</option>
                    <option value="audio">Audio / Listening</option>
                    <option value="slides">Presentación / Diapositivas</option>
                    <option value="video">Video / Conferencia</option>
                    <option value="quiz">Quiz / Formulario</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título del Material</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ej. Unit 3: Irregular Verbs List & Audio Drills"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descripción Breve</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Instrucciones para el alumno..."
                  rows={2}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Enlace a Google Drive o Google Classroom</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://classroom.google.com/..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                >
                  Guardar Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
