import React from "react";
import axios from "axios";
import { FiMinus } from "react-icons/fi";

interface ProductTaskManagerProps {
  product: any;
  onUpdate: (tasks: any[]) => void;
  onProductUpdate?: (updatedProduct: any) => void;
}

const ProductTaskManager: React.FC<ProductTaskManagerProps> = ({ product, onUpdate, onProductUpdate }) => {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const [dirty, setDirty] = React.useState(false);
  const initialLoad = React.useRef(true);
  const [pendingSave, setPendingSave] = React.useState(false);
  const [userTyped, setUserTyped] = React.useState(false);

  React.useEffect(() => {
    let loadedTasks = product.tasks;
    if (typeof loadedTasks === 'string') {
      try {
        loadedTasks = JSON.parse(loadedTasks);
      } catch {
        loadedTasks = [];
      }
    }
    setTasks(Array.isArray(loadedTasks) ? loadedTasks : []);
    console.log('[ProductTaskManager] setTasks from props', loadedTasks);
    initialLoad.current = true;
    setDirty(false);
    setSaveStatus('idle');
    setPendingSave(false);
  }, [product.tasks]);

  // Progress calculation function (keep product logic)
  function calculateProgress(tasks: any[]): number {
    if (!Array.isArray(tasks) || tasks.length === 0) return 0;
    let total = 0;
    for (const task of tasks) {
      if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
        const completed = task.subtasks.filter((sub: any) => sub.checked).length;
        total += completed / task.subtasks.length;
      } else {
        total += task.checked ? 1 : 0;
      }
    }
    return Math.round((total / tasks.length) * 100);
  }

  // Auto-save effect (CEO logic)
  React.useEffect(() => {
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
      console.log('[ProductTaskManager] Auto-save triggered', tasks);
      saveTasks();
      setTimeout(() => setSaveStatus('idle'), 900);
    }, 1000);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, userTyped]);

  // Save tasks and progress
  const saveTasks = async () => {
    if (!dirty) return;
    // Filter out empty tasks and empty subtasks
    const filteredTasks = tasks
      .filter(task => task.title && task.title.trim() !== "")
      .map(task => ({
        ...task,
        subtasks: (task.subtasks || []).filter((sub: any) => sub.title && sub.title.trim() !== "")
      }));
    const newProgress = calculateProgress(filteredTasks);
    console.log('[ProductTaskManager] saveTasks PATCH', { tasks: filteredTasks, progress: newProgress });
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `https://backend.kidsdesigncompany.com/api/product/${product.id}/`,
        { tasks: filteredTasks, progress: newProgress },
        { headers: { Authorization: `JWT ${token}` } }
      );
      setSaveStatus('saved');
      onUpdate(filteredTasks);
      if (onProductUpdate && response && response.data) {
        onProductUpdate(response.data);
      }
      setTimeout(() => setSaveStatus('idle'), 800);
      setDirty(false);
    } catch (err) {
      setSaveStatus('idle');
      alert("Failed to auto-save tasks");
    } finally {
      setIsSaving(false);
    }
  };

  // Add Task
  const handleAddTask = () => {
    // Only add a new task if there is no empty task at the end
    if (tasks.length > 0 && tasks[tasks.length - 1].title.trim() === "") return;
    setTasks((prev) => [...prev, { title: "", checked: false, subtasks: [] }]);
    setUserTyped(false);
  };
  // Edit Task
  const handleTaskChange = (idx: number, field: "title" | "checked", value: any) => {
    setUserTyped(true);
    setTasks((prev) => prev.map((task, i) => {
      if (i !== idx) return task;
      if (field === "checked") {
        // If toggling the main task, also toggle all subtasks to match
        return {
          ...task,
          checked: value,
          subtasks: (task.subtasks || []).map((sub: any) => ({ ...sub, checked: value })),
        };
      }
      // Otherwise, just update the field
      return { ...task, [field]: value };
    }));
    console.log('[ProductTaskManager] handleTaskChange', idx, field, value);
  };
  // Delete Task
  const handleRemoveTask = (idx: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== idx));
  };
  // Add Subtask
  const handleAddSubtask = (taskIdx: number) => {
    setTasks((prev) => prev.map((task, i) =>
      i === taskIdx ? { ...task, subtasks: [...(task.subtasks || []), { title: "", checked: false }] } : task
    ));
    setUserTyped(false);
  };
  // Edit Subtask
  const handleSubtaskChange = (taskIdx: number, subIdx: number, field: "title" | "checked", value: any) => {
    setUserTyped(true);
    setTasks((prev) => prev.map((task, i) => {
      if (i !== taskIdx) return task;
      const updatedSubtasks = (task.subtasks || []).map((sub: any, j: number) =>
        j === subIdx ? { ...sub, [field]: value } : sub
      );
      let checked = task.checked;
      if (field === "checked") {
        // If all subtasks are checked, check the parent task
        if (updatedSubtasks.length > 0 && updatedSubtasks.every((sub: any) => sub.checked)) {
          checked = true;
        } else {
          checked = false;
        }
      }
      return { ...task, subtasks: updatedSubtasks, checked };
    }));
    console.log('[ProductTaskManager] handleSubtaskChange', taskIdx, subIdx, field, value);
  };
  // Delete Subtask
  const handleRemoveSubtask = (taskIdx: number, subIdx: number) => {
    setTasks((prev) => prev.map((task, i) =>
      i === taskIdx ? { ...task, subtasks: (task.subtasks || []).filter((_: any, j: number) => j !== subIdx) } : task
    ));
  };
  return (
    <div className="w-full max-w-2xl min-h-[400px] mx-auto px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 border-b pb-4 gap-2 sm:gap-0">
        <span className="font-bold text-lg sm:text-2xl text-black-200 tracking-tight">Task List</span>
        <div className="flex-1 flex justify-center">
          {saveStatus === 'saving' && !pendingSave && !initialLoad.current && (
            <span className="px-3 sm:px-5 py-1 sm:py-2 bg-blue-100 text-white rounded shadow text-xs">Saving...</span>
          )}
          {saveStatus === 'saved' && !initialLoad.current && (
            <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded shadow text-xs">Saved</span>
          )}
        </div>
        <button
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-400 text-white rounded-lg shadow hover:bg-blue-400 transition-colors text-sm sm:text-base font-medium"
          onClick={handleAddTask}
        >
          <span className="text-lg sm:text-xl leading-none">+</span> Add Task
        </button>
      </div>
      <div className="space-y-4 sm:space-y-6 max-h-[500px] overflow-y-auto pr-2">
        {(!Array.isArray(tasks) || tasks.length === 0) && <div className="text-black-200 text-center text-base sm:text-lg py-8 sm:py-12">No tasks yet.</div>}
        {Array.isArray(tasks) && tasks.map((task, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-xl p-3 sm:p-5 shadow-md group transition-all hover:shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <input
                type="checkbox"
                checked={task.checked}
                onChange={e => handleTaskChange(idx, "checked", e.target.checked)}
                className="accent-blue-400 w-4 h-4 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <input
                className="font-semibold text-base sm:text-lg border-b-2 border-transparent focus:border-blue-400 outline-none bg-transparent flex-1 px-2 py-1 text-black-200 placeholder-black-200 transition-all"
                value={task.title}
                placeholder="Task title"
                onChange={e => handleTaskChange(idx, "title", e.target.value)}
              />
              <button
                className="ml-2 p-1 border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white rounded-full flex items-center justify-center opacity-70 group-hover:opacity-100 transition-all"
                onClick={() => handleRemoveTask(idx)}
                title="Delete Task"
              >
                <FiMinus size={10} />
              </button>
            </div>
            <div className="ml-6 sm:ml-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-black-200 tracking-wide">SubTasks</span>
                <button
                  className="px-2 sm:px-3 py-1 bg-blue-400 text-white rounded-full text-xs font-semibold hover:bg-blue-400 transition-colors"
                  onClick={() => handleAddSubtask(idx)}
                >
                  + Subtask
                </button>
              </div>
              {(task.subtasks || []).length === 0 && <div className="text-black-200 text-xs pl-2 py-2">No subtasks</div>}
              <ul className="space-y-2">
                {(task.subtasks || []).map((sub: any, subIdx: number) => (
                  <li key={subIdx} className="flex items-center gap-2 group/sub mb-1">
                    <input
                      type="checkbox"
                      checked={sub.checked}
                      onChange={e => handleSubtaskChange(idx, subIdx, "checked", e.target.checked)}
                      className="accent-blue-400 w-3 h-3 rounded border-2 border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
                    />
                    <input
                      className="text-sm sm:text-base border-b border-transparent focus:border-blue-400 outline-none bg-transparent flex-1 px-2 py-1 text-black-200 placeholder-black-200 transition-all"
                      value={sub.title}
                      placeholder="Subtask title"
                      onChange={e => handleSubtaskChange(idx, subIdx, "title", e.target.value)}
                    />
                    <button
                      className="ml-2 p-1 border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white rounded-full flex items-center justify-center opacity-70 group-hover/sub:opacity-100 transition-all"
                      onClick={() => handleRemoveSubtask(idx, subIdx)}
                      title="Delete Subtask"
                    >
                      <FiMinus size={7} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTaskManager; 