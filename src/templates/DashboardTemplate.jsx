import PropTypes from 'prop-types';
import { AnimatePresence } from 'framer-motion';
import AppHeader from '../components/organisms/AppHeader';
import Sidebar from '../components/organisms/Sidebar';
import SearchBar from '../components/molecules/SearchBar';
import FAB from '../components/molecules/FAB';

const DashboardTemplate = ({
  headerProps,
  sidebarProps,
  mainContent,
  mobileSearchProps,
  fabProps,
  sidebarCollapsed,
  setSidebarCollapsed,
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${headerProps.darkMode ? 'dark' : ''}`}>
      <AppHeader {...headerProps} />

      <div className="flex pt-14">
        <Sidebar isCollapsed={sidebarCollapsed} {...sidebarProps} />

        <main className="flex-1 p-4 lg:p-6 space-y-6">
          {mainContent}
        </main>
      </div>

      <div className="md:hidden fixed bottom-4 left-4 right-4 z-30">
        <SearchBar className="w-full" {...mobileSearchProps} />
      </div>

      <FAB {...fabProps} />

      {!sidebarCollapsed && (
        <AnimatePresence>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setSidebarCollapsed(true)}
          />
        </AnimatePresence>
      )}
    </div>
  );
};

DashboardTemplate.propTypes = {
  headerProps: PropTypes.object.isRequired,
  sidebarProps: PropTypes.object.isRequired,
  mainContent: PropTypes.node.isRequired,
  mobileSearchProps: PropTypes.object.isRequired,
  fabProps: PropTypes.object.isRequired,
  sidebarCollapsed: PropTypes.bool.isRequired,
  setSidebarCollapsed: PropTypes.func.isRequired,
};

export default DashboardTemplate;