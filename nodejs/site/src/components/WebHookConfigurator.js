import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useAppContext } from '../contexts/AppContext';
import { CONTEXTS } from '../constants';
import { db } from '../firebase';
import ActionRows from './ActionRows';
import Selection from './Selection';

const useStyles = makeStyles((theme) => ({
  formControl: {},
}));
// TODO: Load these from database
const availableContext = [
  {
    id: 0,
    name: 'zero',
  },
  {
    id: 1,
    name: 'one',
  },
  {
    id: 2,
    name: 'two',
  },
];

const WebhookConfigurator = (props) => {
  const [context, setContext] = useAppContext();
  useEffect(() => {
    //TODO: load context here wait on schema.data
  }, [context]);

  const onChange = (event) => {
    console.log('CHANGING CONTEXT');
    // TODO: just set context id and name, let the effect load the data
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
  const { control, handleSubmit, watch } = useForm({
    defaultValues: { ...context, data: context?.data ?? [{ endpoints: [{}] }] },
  });
  const onSubmit = ({ data }) => {
    const doc = db.doc(`${CONTEXTS}/${context.id}`);
    const payload = {
      id: context.id,
      name: context.name,
      data,
    };
    doc.set(payload);
    // TODO: just set context value and id, let top useeffect load the data
    // const nextContext = availableContext.find((t) => t.id === nextContextId);
    // setContext({ ...data, ...nextContext });
  };

  console.log('in form context is', context);
  const actions = Object.values(context?.data ?? {});

  // TODO: HANDLE ERRORS
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ActionRows actions={actions} control={control} watch={watch} />

      <input type="submit" />
    </form>
  );
};

export default WebhookConfigurator;
