import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loader = (props) => {
  const { pending, Component = null } = props;
  return pending ? <CircularProgress /> : Component;
};

Loader.propTypes = {
  pending: PropTypes.bool.isRequired,
  Component: PropTypes.element,
};

export default Loader;
