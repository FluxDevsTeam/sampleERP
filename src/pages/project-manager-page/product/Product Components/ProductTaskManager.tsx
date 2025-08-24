import React, { useRef, useEffect } from "react";
import axios from "axios";
import { FiMinus } from "react-icons/fi";

interface ProductTaskManagerProps {
  product: any;
  onUpdate: (tasks: any[]) => void;
  scrollToLastTaskTrigger?: number;
  onProductUpdate?: (updatedProduct: any) => void;
}

const ProductTaskManager: React.FC<ProductTaskManagerProps> = ({ product, onUpdate, scrollToLastTaskTrigger, onProductUpdate }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const role = localStorage.getItem("user_role");
    setUserRole(role);
  }, []);
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const [dirty, setDirty] = React.useState(false);
  const initialLoad = React.useRef(true);
  const [pendingSave, setPendingSave] = React.useState(false);
  const [userTyped, setUserTyped] = React.useState(false);

  // Ref for last task
  const lastTaskRef = useRef<HTMLDivElement>(null);

  // Scroll to last task when trigger changes
  useEffect(() => {
    if (typeof scrollToLastTaskTrigger === 'number' && tasks.length > 0) {
      setTimeout(() => {
        lastTaskRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [scrollToLastTaskTrigger, tasks.length]);

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
    initialLoad.current = true;
    setDirty(false);
    setSaveStatus('idle');
    setPendingSave(false);
  }, [product.tasks]);

  // Auto-save effect
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
      saveTasks();
      setTimeout(() => setSaveStatus('idle'), 900);
    }, 1000);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, userTyped]);

  // 1. Progress calculation function
  function calculateProgress(tasks: any[]): number {
    if (!Array.isArray(tasks) || tasks.length === 0) return 0;
    let total = 0;
    for (const task of tasks) {
      if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
        // Task progress is the fraction of checked subtasks
        const completed = task.subtasks.filter((sub: any) => sub.checked).length;
        total += completed / task.subtasks.length;
      } else {
        // Task progress is 1 if checked, 0 if not
        total += task.checked ? 1 : 0;
      }
    }
    return Math.round((total / tasks.length) * 100);
  }

  // 2. Update saveTasks to also PATCH progress
  const saveTasks = async (customTasks?: any[]) => {
    const tasksToSave = customTasks || tasks;
    // Filter out empty tasks and empty subtasks
    const filteredTasks = tasksToSave
      .filter(task => task.title && task.title.trim() !== "")
      .map(task => ({
        ...task,
        subtasks: (task.subtasks || []).filter((sub: any) => sub.title && sub.title.trim() !== "")
      }));
    const newProgress = calculateProgress(filteredTasks);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `https://backend.kidsdesigncompany.com/api/product/${product.id}/`,
        { tasks: JSON.stringify(filteredTasks), progress: newProgress },
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
    setTasks((prev) => {
      const updated = prev.map((task, i) => {
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
      });
      // Do NOT call saveTasks here; let the debounced effect handle it
      return updated;
    });
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
    setTasks((prev) => {
      const updated = prev.map((task, i) => {
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
      });
      // Do NOT call saveTasks here; let the debounced effect handle it
      return updated;
    });
  };
  // Delete Subtask
  const handleRemoveSubtask = (taskIdx: number, subIdx: number) => {
    setTasks((prev) => prev.map((task, i) =>
      i === taskIdx ? { ...task, subtasks: (task.subtasks || []).filter((_: any, j: number) => j !== subIdx) } : task
    ));
  };

  // Calculate progress percentage
  const progress = calculateProgress(tasks);

  return (
    <div className="max-w-2xl  min-h-[500px] md:min-h-[700px] lg:min-h-[550px]  mx-auto">
      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-blue-700">Progress</span>
          <span className="text-xs font-semibold text-blue-700">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <span className="font-bold text-2xl text-black-200 tracking-tight">Task List</span>
        <div className="flex-1 flex justify-center">
          {saveStatus === 'saving' && !pendingSave && !initialLoad.current && (
            <span className="px-5 py-2 bg-blue-100 text-white rounded shadow text-xs">Saving...</span>
          )}
          {saveStatus === 'saved' && !initialLoad.current && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded shadow text-xs">Saved</span>
          )}
        </div>
        {userRole !== "storekeeper" && (
          <button
            className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            onClick={handleAddTask}
          >
            <span className="text-xl leading-none">+</span> Add Task
          </button>
        )}
      </div>
      <div className="space-y-2 max-h-[580px] lg:max-h-[430px] max-sm:max-h-[440px]  overflow-y-auto ">
        {(!Array.isArray(tasks) || tasks.length === 0) && <div className="text-black-200 text-center text-lg py-12">No tasks yet.</div>}
        {Array.isArray(tasks) && tasks.map((task, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl p-2 shadow-md group transition-all hover:shadow-lg"
            ref={idx === tasks.length - 1 ? lastTaskRef : undefined}
          >
            <div className="flex items-center gap-1 mb-1 md:px-5">
              <input
                type="checkbox"
                checked={task.checked}
                onChange={e => userRole !== "storekeeper" && handleTaskChange(idx, "checked", e.target.checked)}
                className="accent-blue-400 w-4 h-4 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
                readOnly={userRole === "storekeeper"}
              />
              <input
                className="font-semibold text-base md:text-lg border-b-2 border-transparent focus:border-blue-400 outline-none bg-transparent flex-1 px-2 py-1 text-black-200 placeholder-black-200 transition-all"
                value={task.title}
                placeholder="Task title"
                onChange={e => handleTaskChange(idx, "title", e.target.value)}
                readOnly={userRole === "storekeeper"}
              />
              {userRole !== "storekeeper" && (
                <button
                  className="md:ml-2 p-1 border-2 border-400 text-red-400 hover:bg-red-400 hover:text-white rounded-full flex items-center justify-center opacity-70 group-hover:opacity-100 transition-all"
                  onClick={() => handleRemoveTask(idx)}
                  title="Delete Task"
                >
                  <FiMinus size={10} />
                </button>
              )}
            </div>
            <div className="ml-8 md:px-5">
              <div className="flex justify-between items-center mb-0">
                <span className="text-xs font-medium text-black-200 tracking-wide">SubTasks</span>
                {userRole !== "storekeeper" && (
                  <button
                    className="px-3 py-1 border-2 border-blue-400 text-blue-400 bg-transparent rounded-full text-xs font-semibold hover:bg-blue-400 hover:text-white transition-colors"
                    onClick={() => handleAddSubtask(idx)}
                  >
                    + SubTask
                  </button>
                )}
              </div>
              {(task.subtasks || []).length === 0 && <div className="text-black-200 text-xs pl-2 py-2">No subtasks</div>}
              <ul className="space-y-1">
                {(task.subtasks || []).map((sub: any, subIdx: number) => (
                  <li key={subIdx} className="flex items-center gap-0 group/sub mb-1 ">
                    <input
                      type="checkbox"
                      checked={sub.checked}
                      onChange={e => userRole !== "storekeeper" && handleSubtaskChange(idx, subIdx, "checked", e.target.checked)}
                      className="accent-blue-400 w-3 h-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all"
                      readOnly={userRole === "storekeeper"}
                    />
                    <input
                      className="text-sm md:text-base border-b border-transparent focus:border-blue-400 outline-none bg-transparent flex-1 px-2 py-1 text-black-200 placeholder-black-200 transition-all"
                      value={sub.title}
                      placeholder="Subtask title"
                      onChange={e => handleSubtaskChange(idx, subIdx, "title", e.target.value)}
                      readOnly={userRole === "storekeeper"}
                    />
                    {userRole !== "storekeeper" && (
                      <button
                        className="md:ml-2 ml-1 p-1 border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white rounded-full flex items-center justify-center opacity-70 group-hover/sub:opacity-100 transition-all"
                        onClick={() => handleRemoveSubtask(idx, subIdx)}
                        title="Delete Subtask"
                      >
                        <FiMinus size={6} />
                      </button>
                    )}
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