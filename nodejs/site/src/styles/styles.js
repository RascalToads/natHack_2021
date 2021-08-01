import { createTheme } from '@material-ui/core/styles'
import { create } from 'jss';
import jssTemplate from 'jss-plugin-template';
import {
  jssPreset,
  responsiveFontSizes,
  StylesProvider,
  ThemeProvider,
} from '@material-ui/core/styles';
import { overrides } from './overrides';
import { palette } from './palette';
import { typography } from './typography';
import './styles.css';


const Styles = ({ children }) => (
  <StylesProvider jss={jss}>
    <ThemeProvider theme={theme}> {children} </ThemeProvider>
  </StylesProvider>
);

const jss = create({
  plugins: [jssTemplate(), ...jssPreset().plugins],
});

const responsiveTheme = responsiveFontSizes(theme);

const theme = createTheme({
  overrides,
  palette,
  typography,
});

Styles.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Styles;