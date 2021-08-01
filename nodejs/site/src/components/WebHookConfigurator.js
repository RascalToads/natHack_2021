import { Controller, useForm } from 'react-hook-form';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useAppContext } from '../contexts/AppContext';
import { Button, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  formControl: {},
}));

const availableContext = [
  {
    id: 0,
    name: 'zero',
  },
];

const WebhookConfigurator = (props) => {
  const [context, setContext] = useAppContext();

  const onChange = (event) => {
    console.log('CHANGING CONTEXT');
    setContext(availableContext.find((t) => t.id === event.target.value));
  };

  return (
    <Container>
      <Typography variant="h1">'WHC|</Typography>
      <Selection
        onChange={onChange}
        helperText="Select a Context"
        options={availableContext}
        title="Context"
        value={context?.id ?? ''}
      />
      <ConfigurationForm context={context} setContext={setContext} />
    </Container>
  );
};

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
  const classes = useStyles();
  return (
    <FormControl variant="filled" className={classes.formControl}>
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

const ConfigurationForm = (props) => {
  const { context, setContext } = props;
  const { control, handleSubmit } = useForm();
  const onSubmit = ({ context: nextContextId, ...data }) => {
    //TODO: UPDATE FOR ACTIONS
    // TODO: SAVE TO FIRESTORE
    const nextContext = availableContext.find((t) => t.id === nextContextId);
    setContext({ ...data, ...nextContext });
  };

  console.log('in form context is', context);
  // TODO: HANDLE ERRORS
  // TODO: SUBMIT TO FIRESTORE
  const data = {};
  const i = 0;
  const addEndpoint = addEndpointThunk(props);
  const addAction = addActionThunk(props);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* TODO: add array here */}
      <ControlledSelection
        control={control}
        rules={{ required: true }}
        helperText="Select an Action"
        options={availableContext}
        title={`Action ${i + 1}`}
        tag="action"
        value={data.action ?? ''}
      />
      <ControlledSelection
        control={control}
        rules={{ required: true }}
        helperText="Select an Action"
        options={availableContext}
        title="Value Type"
        tag="valueType"
        value={data.action ?? ''}
      />
      {/* TODO: add array here */}
      <ControlledTextField
        control={control}
        rules={{ required: true }} // TODO: format!
        helperText="Select a Context"
        options={availableContext}
        title={`Endpoint ${i + 1}`}
      />
      <Button
        aria-label="add"
        color="primary"
        startIcon={<AddIcon />}
        variant="contained"
        onClick={addEndpoint(i)}
      >
        Add
      </Button>
      {/* TODO: close rows and make last row add button */}
      <Button
        aria-label="add"
        color="primary"
        startIcon={<AddIcon />}
        variant="contained"
        onClick={addAction()}
      >
        Add
      </Button>

      <input type="submit" />
    </form>
  );
};

const addEndpointThunk = (details) => (index) => {}; //TODO:
const addActionThunk = (details) => (index) => {}; //TODO:

const ControlledSelection = (props) => {
  const {
    rules,
    control,
    title,
    tag = title?.toLowerCase(),
    value = '',
  } = props;
  return (
    <Controller
      name={tag}
      control={control}
      defaultValue={value}
      rules={rules}
      render={({ field }) => {
        const formBag = field;
        delete formBag.ref;
        return <Selection {...props} {...formBag} />;
      }}
    />
  );
};

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
export default WebhookConfigurator;
