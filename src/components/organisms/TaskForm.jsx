import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import { toast } from 'react-toastify';

const TaskForm = ({ task, projects, users, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    projectId: '',
    assignee: '',
    tags: []
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || '',
        projectId: task.projectId || '',
        assignee: task.assignee || '',
        tags: task.tags || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        projectId: '',
        assignee: '',
        tags: []
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, tags: value.split(',').map(tag => tag.trim()).filter(tag => tag) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    onSubmit(formData);
  };

  const projectOptions = projects?.map(p => ({ value: p.id, label: p.name })) || [];
  const userOptions = users?.map(u => ({ value: u.id, label: u.name })) || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Task Title *"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter task title..."
        required
      />
      <FormField
        label="Description"
        type="textarea"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Add a description..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Priority"
          type="select"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'urgent', label: 'Urgent' },
          ]}
        />
        <FormField
          label="Due Date"
          type="datetime-local"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Project"
          type="select"
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
          options={[{ value: '', label: 'No Project' }, ...projectOptions]}
        />
        <FormField
          label="Assignee"
          type="select"
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          options={[{ value: '', label: 'Unassigned' }, ...userOptions]}
        />
      </div>

      <FormField
        label="Tags (comma-separated)"
        name="tags"
        value={formData.tags.join(', ')}
        onChange={handleTagsChange}
        placeholder="e.g., design, frontend, bug"
      />

      <div className="flex space-x-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

TaskForm.propTypes = {
  task: PropTypes.object, // Can be null for creation
  projects: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default TaskForm;