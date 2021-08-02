import { Controller } from 'react-hook-form';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

const ControlledTextField = (props) => {
  const {
    control,
    error,
    errorText,
    helperText,
    placeholder,
    rules,
    title,
    tag = title?.toLowerCase(),
    value = '',
    variant = 'filled',
  } = props;
  return (
    <Controller
      name={tag}
      control={control}
      defaultValue={value}
      rules={rules}
      render={({ field }) => (
        <FormControl>
          <TextField
            id={tag}
            error={error}
            label={title}
            helperText={error ? errorText : helperText}
            placeholder={placeholder}
            variant={variant}
            {...field}
          />
        </FormControl>
      )}
    />
  );
};
export default ControlledTextField;
