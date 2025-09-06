import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * DocumentTitle - A component that updates the document title and meta description
 * @param {Object} props - Component props
 * @param {string} props.title - The page title to set
 * @param {string} [props.description] - Optional meta description
 * @returns {null} Renders nothing
 */
const DocumentTitle = ({ title, description }) => {
  useEffect(() => {
    // Set document title
    if (title) {
      document.title = title;
    }

    // Update meta description if provided
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      
      metaDescription.content = description;
    }

    // Cleanup function to reset title and description when component unmounts
    return () => {
      document.title = 'SkillUp - Online Learning Platform';
      const defaultMeta = document.querySelector('meta[name="description"]');
      if (defaultMeta) {
        defaultMeta.content = 'SkillUp is an online learning platform offering high-quality courses in various fields. Enhance your skills with our expert-led courses.';
      }
    };
  }, [title, description]);

  return null;
};

DocumentTitle.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string
};

export default DocumentTitle;
