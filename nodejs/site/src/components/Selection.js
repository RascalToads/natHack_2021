import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formControl: {},
}));

const Selection = (props) => {
  const {
    onChange,
    helperText,
    options,
    register,
    control,
    placeholder,
    title,
    tag = title?.toLowerCase(),
    value = '',
  } = props;
  const styles = useStyles();
  return (
    <FormControl variant="filled" className={styles.formControl}>
      <InputLabel id={`select-${tag}-label`}>{title}</InputLabel>
      <Select
        id={`select-${tag}`}
        labelId={`select-${tag}-label`}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        {...(register ? register(tag) : {})}
        control={control}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options.map(({ id, name }) => (
          <MenuItem key={id} value={id}>
            {name ?? id}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default Selection;
