import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../atoms/Button';
import Select from '../atoms/Select';
import Input from '../atoms/Input';
import AppIcon from '../atoms/AppIcon';
import Text from '../atoms/Text';

const FilterBar = ({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  showCompletedTasks,
  onToggleCompletedTasks,
  priorityFilter,
  onPriorityFilterChange,
  assigneeFilter,
  onAssigneeFilterChange,
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  projects,
  users,
  selectedTasks,
  onBulkAction,
  onClearSelection
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="filter-bar bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-4">
      {/* Main Filter Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Left Side - View Controls */}
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { id: 'list', icon: 'List', label: 'List' },
              { id: 'board', icon: 'Columns', label: 'Board' }
            ].map(view => (
              <Button
                key={view.id}
                variant="ghost"
                onClick={() => onViewModeChange(view.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm ${
                  viewMode === view.id
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <AppIcon name={view.icon} className="w-4 h-4" />
                <span className="hidden sm:inline">{view.label}</span>
              </Button>
            ))}
          </div>

          {/* Hide/Show Completed */}
          <Button
            onClick={onToggleCompletedTasks}
            className={`flex items-center space-x-2 px-3 py-1.5 text-sm rounded-lg ${
              showCompletedTasks
                ? 'bg-secondary text-white hover:bg-secondary-dark'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <AppIcon name={showCompletedTasks ? 'EyeOff' : 'Eye'} className="w-4 h-4" />
            <span className="hidden sm:inline">
              {showCompletedTasks ? 'Hide' : 'Show'} Completed
            </span>
          </Button>
        </div>

        {/* Right Side - Sort and Filter Controls */}
        <div className="flex items-center space-x-3">
          {/* Sort By */}
          <Select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="text-sm py-1.5 w-auto min-w-32"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
            <option value="created">Created</option>
            <option value="updated">Updated</option>
          </Select>

          {/* Advanced Filters Toggle */}
          <Button
            variant="secondary"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center space-x-2 px-3 py-1.5 text-sm ${
              showAdvancedFilters ? 'bg-primary text-white' : ''
            }`}
          >
            <AppIcon name="Filter" className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            <AppIcon 
              name={showAdvancedFilters ? 'ChevronUp' : 'ChevronDown'} 
              className="w-3 h-3 ml-1" 
            />
          </Button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedTasks.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <Text variant="sm" className="font-medium text-primary">
              {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
            </Text>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                className="text-sm px-3 py-1"
                onClick={() => onBulkAction('complete')}
              >
                <AppIcon name="Check" className="w-3 h-3 mr-1" />
                Complete
              </Button>
              <Button
                variant="secondary"
                className="text-sm px-3 py-1 text-red-600 hover:bg-red-50"
                onClick={() => onBulkAction('delete')}
              >
                <AppIcon name="Trash2" className="w-3 h-3 mr-1" />
                Delete
              </Button>
              <Button
                variant="secondary"
                className="text-sm px-3 py-1"
                onClick={onClearSelection}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Priority Filter */}
            <div>
              <Text variant="sm" className="font-medium mb-2 text-gray-700 dark:text-gray-300">
                Priority
              </Text>
              <Select
                value={priorityFilter}
                onChange={(e) => onPriorityFilterChange(e.target.value)}
                className="text-sm w-full"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Assignee Filter */}
            <div>
              <Text variant="sm" className="font-medium mb-2 text-gray-700 dark:text-gray-300">
                Assignee
              </Text>
              <Select
                value={assigneeFilter}
                onChange={(e) => onAssigneeFilterChange(e.target.value)}
                className="text-sm w-full"
              >
                <option value="all">All Assignees</option>
                <option value="unassigned">Unassigned</option>
                {users?.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Text variant="sm" className="font-medium mb-2 text-gray-700 dark:text-gray-300">
                Status
              </Text>
              <Select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="text-sm w-full"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <Text variant="sm" className="font-medium mb-2 text-gray-700 dark:text-gray-300">
                Due Date
              </Text>
              <Select
                value={dateRange}
                onChange={(e) => onDateRangeChange(e.target.value)}
                className="text-sm w-full"
              >
                <option value="all">All Dates</option>
                <option value="overdue">Overdue</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this-week">This Week</option>
                <option value="next-week">Next Week</option>
                <option value="no-date">No Due Date</option>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end mt-4">
            <Button
              variant="secondary"
              onClick={() => {
                onPriorityFilterChange('all');
                onAssigneeFilterChange('all');
                onStatusFilterChange('all');
                onDateRangeChange('all');
              }}
              className="text-sm px-3 py-1.5"
            >
              <AppIcon name="X" className="w-3 h-3 mr-1" />
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

FilterBar.propTypes = {
  viewMode: PropTypes.string.isRequired,
  onViewModeChange: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  onSortByChange: PropTypes.func.isRequired,
  showCompletedTasks: PropTypes.bool.isRequired,
  onToggleCompletedTasks: PropTypes.func.isRequired,
  priorityFilter: PropTypes.string.isRequired,
  onPriorityFilterChange: PropTypes.func.isRequired,
  assigneeFilter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onAssigneeFilterChange: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  onStatusFilterChange: PropTypes.func.isRequired,
  dateRange: PropTypes.string.isRequired,
  onDateRangeChange: PropTypes.func.isRequired,
  projects: PropTypes.array,
  users: PropTypes.array,
  selectedTasks: PropTypes.array.isRequired,
  onBulkAction: PropTypes.func.isRequired,
  onClearSelection: PropTypes.func.isRequired,
};

export default FilterBar;