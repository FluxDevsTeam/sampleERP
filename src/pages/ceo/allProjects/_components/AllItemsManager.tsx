import React, { useRef, useEffect } from "react";
import { FiMinus, FiEdit2 } from "react-icons/fi";
import projectsData from "@/data/ceo/project/projects.json";

interface AllItemsManagerProps {
  project: any;
  onUpdate: (items: any[]) => void;
  onClose: () => void;
}

const saveProjectsToJson = async (updatedProjects: any[]) => {
  localStorage.setItem("projects", JSON.stringify(updatedProjects));
  return updatedProjects;
};

const AllItemsManager: React.FC<AllItemsManagerProps> = ({ project, onUpdate, onClose }) => {
  const [items, setItems] = React.useState<any[]>([]);
  const [editingAll, setEditingAll] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const userRole = typeof window !== "undefined" ? localStorage.getItem("user_role") : null;
  const [dirty, setDirty] = React.useState(false);
  const initialLoad = React.useRef(true);
  const [pendingSave, setPendingSave] = React.useState(false);
  const [userTyped, setUserTyped] = React.useState(false);
  const lastItemRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let loadedItems = project.all_items;
    if (typeof loadedItems === 'string') {
      try {
        loadedItems = JSON.parse(loadedItems);
      } catch {
        loadedItems = [];
      }
    }
    setItems(Array.isArray(loadedItems) ? loadedItems : []);
    initialLoad.current = true;
    setDirty(false);
    setSaveStatus('idle');
    setPendingSave(false);
  }, [project.all_items]);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    if (!userTyped) return;
    setDirty(true);
    setPendingSave(true);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      setPendingSave(false);
      setSaveStatus('saving');
      setIsSaving(true);
      saveItems();
      setTimeout(() => setSaveStatus('idle'), 900);
    }, 1000);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [items, userTyped]);

  const saveItems = async () => {
    if (!dirty) return;
    try {
      const updatedProjects = projectsData.all_projects.map((p) =>
        p.id === project.id ? { ...p, all_items: items } : p
      );
      await saveProjectsToJson({ ...projectsData, all_projects: updatedProjects });
      setSaveStatus('saved');
      onUpdate(items);
      setDirty(false);
    } catch (err) {
      setSaveStatus('idle');
      alert("Failed to auto-save items");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = async () => {
    if (dirty) {
      await saveItems();
    }
    onClose();
  };

  const handleAddItem = () => {
    if (items.length > 0 && (!items[items.length - 1].item || items[items.length - 1].item.trim() === "")) return;
    setItems((prev) => [...prev, { item: "", price: "0", budget: "0", quantity: 1 }]);
    setUserTyped(false);
    setEditingAll(true);
    setTimeout(() => {
      if (lastItemRef.current) {
        lastItemRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  const handleItemChange = (idx: number, field: "item" | "price" | "budget" | "quantity", value: any) => {
    setUserTyped(true);
    setItems((prev) => prev.map((itm, i) => i === idx ? { ...itm, [field]: value } : itm));
  };

  const handleRemoveItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
    setUserTyped(true);
    setDirty(true);
    saveItems();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-2 sm:p-8 max-w-4xl min-h-[400px] w-full relative shadow-2xl flex flex-col max-h-[98vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 border-b bg-white rounded-t-2xl">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black-200">All Items for <span className="text-blue-400">{project.name}</span></h2>
          <div className="flex gap-2 items-center">
            <button
              className={`p-2 border-2 rounded-full flex items-center justify-center transition-all
                ${editingAll ? 'border-blue-600 text-white bg-blue-600 shadow-lg' : 'border-blue-400 text-blue-400 bg-white hover:bg-blue-100 hover:text-blue-700'}`}
              onClick={() => setEditingAll((prev) => !prev)}
              title={editingAll ? "Stop Editing" : "Edit All Items"}
              aria-label="Edit All Items"
            >
              <FiEdit2 size={20} className={editingAll ? 'text-white' : ''} />
            </button>
            <button
              className="text-xl text-gray-700 hover:text-gray-700 transition-colors p-2 rounded-full border border-gray-700 bg-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleClose}
              aria-label="Close"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : '✕'}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-0 md:px-8 py-6 space-y-6 bg-gray-50">
          {(!Array.isArray(items) || items.length === 0) && (
            <div className="text-gray-400 text-center text-lg py-24">No items yet. Click <span className='font-semibold text-blue-400'>+ Add Item</span> to get started.</div>
          )}
          {Array.isArray(items) && items.map((itm, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-2 shadow group flex flex-col gap-2 relative transition-all hover:shadow-lg"
              ref={idx === items.length - 1 ? lastItemRef : null}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-black-400 mb-1">Name</label>
                  {editingAll ? (
                    <input
                      className="font-semibold text-md border-b-2 border-blue-400 focus:border-blue-600 outline-none bg-transparent flex-1 px-2 py-2 text-black-400 placeholder-black-400 transition-all"
                      value={itm.item}
                      placeholder="Item name"
                      onChange={e => handleItemChange(idx, "item", e.target.value)}
                    />
                  ) : (
                    <span className="font-semibold text-md text-black-400 px-2 py-2">{itm.item || <span className='text-gray-300'>—</span>}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-black-400 mb-1">Quantity</label>
                  {editingAll ? (
                    <input
                      className="text-md border-b-2 border-blue-400 focus:border-blue-600 outline-none bg-transparent w-full px-2 py-2 text-black-400 placeholder-black-400 transition-all"
                      value={itm.quantity}
                      placeholder="Quantity"
                      type="number"
                      min="1"
                      onChange={e => handleItemChange(idx, "quantity", e.target.value)}
                    />
                  ) : (
                    <span className="text-md text-black-400 px-2 py-2">{itm.quantity || <span className='text-gray-300'>—</span>}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-black-400 mb-1">Budget</label>
                  {editingAll ? (
                    <input
                      className="text-md border-b-2 border-blue-400 focus:border-blue-600 outline-none bg-transparent w-full px-2 py-2 text-black-400 placeholder-black-400 transition-all"
                      value={itm.budget}
                      placeholder="0"
                      type="number"
                      min="0"
                      onChange={e => handleItemChange(idx, "budget", e.target.value)}
                    />
                  ) : (
                    <span className="text-md text-black-400 px-2 py-2">{itm.budget ? `₦${itm.budget}` : '₦0'}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-black-400 mb-1">Price</label>
                  {editingAll ? (
                    <input
                      className="text-md border-b-2 border-blue-400 focus:border-blue-600 outline-none bg-transparent w-full px-2 py-2 text-black-400 placeholder-black-400 transition-all"
                      value={itm.price}
                      placeholder="0"
                      type="number"
                      min="0"
                      onChange={e => handleItemChange(idx, "price", e.target.value)}
                    />
                  ) : (
                    <span className="text-md text-black-400 px-2 py-2">{itm.price ? `₦${itm.price}` : '₦0'}</span>
                  )}
                </div>
              </div>
              {editingAll && (
                <div className="flex gap-2 absolute top-4 right-4">
                  <button
                    className="p-1 border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all"
                    onClick={() => handleRemoveItem(idx)}
                    title="Delete Item"
                    aria-label="Delete Item"
                  >
                    <FiMinus size={15} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="sticky bottom-0 z-10 flex items-center justify-between px-8 py-2 mb-10 border-t bg-white rounded-b-2xl shadow-inner">
          <button
            className="px-6 py-3 bg-blue-400 text-white rounded-lg shadow hover:bg-blue-600 transition-colors text-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleAddItem}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : '+ Add Item'}
          </button>
          <div className="flex items-center gap-4">
            {saveStatus === 'saving' && !pendingSave && !initialLoad.current && (
              <span className="px-5 py-2 bg-blue-100 text-white rounded shadow text-xs">Saving...</span>
            )}
            {saveStatus === 'saved' && !initialLoad.current && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded shadow text-xs">Saved</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllItemsManager;