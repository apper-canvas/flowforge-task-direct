import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/atoms/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-soft"
        >
          <ApperIcon name="SearchX" className="w-12 h-12 text-white" />
        </motion.div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-card hover:-translate-y-0.5"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center space-x-1 hover:text-primary transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
              <span>Go Back</span>
            </button>
            <span>•</span>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center space-x-1 hover:text-primary transition-colors"
            >
              <ApperIcon name="RotateCcw" className="w-4 h-4" />
              <span>Refresh Page</span>
            </button>
          </div>
        </div>
        
        <motion.div 
          className="mt-12 text-xs text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          FlowForge Task Management • Page Not Found
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound