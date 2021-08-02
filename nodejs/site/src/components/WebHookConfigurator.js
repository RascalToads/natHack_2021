import { useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { useAppContext } from '../contexts/AppContext';
import { CONTEXTS } from '../constants';
import { db } from '../firebase';
import ConfigurationForm from './ConfigurationForm';
import Selection from './Selection';

// TODO: Load these from database
const availableContext = [
  {
    id: 0,
    name: 'Chris (0)',
  },
  {
    id: 1,
    name: 'Jemima(1)',
  },
  {
    id: 2,
    name: 'Dan(2)',
  },
  {
    id: 3,
    name: 'James(3)',
  },
  {
    id: 4,
    name: 'Michael(4)',
  },
];

const WebhookConfigurator = (props) => {
  const [context, setContext] = useAppContext();
  useEffect(() => {
    let current = true;
    const loadData = async () => {
      const ref = await db.doc(`${CONTEXTS}/${context.id}`).get();
      if (!current) return;
      const docData = ref.exists
        ? ref.data()
        : {
            id: context.id,
            name: context.name,
            data: null,
          };
      if (isEqual(docData, context)) return;
      const { id = context.id, name = context.name, data = null } = docData;
      setContext({ id, name, data });
    };
    if (Object.values(context).length) loadData();
    return () => (current = false);
  }, [context, setContext]);

  const onChange = (event) => {
    setContext(availableContext.find((t) => t.id === event.target.value));
  };

  return (
    <Container>
      <Typography variant="h1">
        WHC|
        <Typography variant="subtitle1">
          {'<'}Webhook Configurator{'>'}
        </Typography>
      </Typography>
      <Typography variant="h2">natHACKS 2021 - RascalToads</Typography>
      <Selection
        onChange={onChange}
        helperText="Select a Context"
        options={availableContext}
        title="Context"
        value={context?.id ?? ''}
      />
      {/* TODO: fix this nested boolean */}
      {Object.values(context).length < 3 ? (
        !!context.id ? (
          <CircularProgress />
        ) : (
          <h2>Please select a context</h2>
        )
      ) : (
        <ConfigurationForm context={context} setContext={setContext} />
      )}
    </Container>
  );
};

export default WebhookConfigurator;
