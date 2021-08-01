import { useForm } from 'react-hook-form';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useAppContext } from '../contexts/AppContext';
import ControlledSelection from './ControlledSelection';
import ControlledTextField from './ControlledTextField';
import Selection from './Selection';

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
      {/* TODO: add loading when context changes and there is no data fetched */}
      <ConfigurationForm context={context} setContext={setContext} />
    </Container>
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

export default WebhookConfigurator;
