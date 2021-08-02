import { useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { useAppContext } from '../contexts/AppContext';
import { CONTEXTS } from '../constants';
import { db } from '../firebase';
import ConfigurationForm from './ConfigurationForm';
import Loader from './Loader';
import Selection from './Selection';
import { Box, Divider } from '@material-ui/core';

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
    setContext(availableContext.find((t) => t.id === event.target.value) ?? {});
  };

  const awaitingContextSelection =
    Object.values(context).length < 3 && !!!context?.id;
  return (
    <Container>
      <Typography variant="h1">
        WHC|
        <Typography variant="subtitle1">
          {'<'}Webhook Configurator{'>'}
        </Typography>
      </Typography>
      <Typography variant="h2">natHACKS 2021 - RascalToads</Typography>
      <Divider />
      <Box marginTop={2} marginBottom={1}>
        {awaitingContextSelection && (
          <Typography variant="body1">
            For our submissions for{' '}
            <a
              href="https://nathacks.devpost.com/"
              rel="noreferrer"
              target="_blank"
            >
              natHACKS 2021
            </a>
            , the RascalToads team had one goal in mind, "How do we control
            physical things with our mind?" Most BCI is local between the device
            and a single computer. We wanted to reach out into the world and do
            something. Here is what we did.
            <br />
            <br />
            We trained software to classify gestures from a Muse headsets. These
            included detections like winks, blinks, and brow movements. Now that
            we had gestures, we needed to get them off our computers. To start
            that journey, we leveraged webhooks. Webhooks allows web
            communication between conforming parties. We created the Webhook
            Configurator(WHC) to bridge the varying modes of communication.
            <br />
            <br />
            Data is sent to the backend from either the{' '}
            <a
              href="https://github.com/RascalToads/natHack_2021"
              rel="noreferrer"
              target="_blank"
            >
              Petal Metrics app
            </a>{' '}
            or the python script. With WHC serving as a translator, we can send
            these received gestures outward. We can control who, what, and when
            detections are delivered. In WHC, you can select which detect to
            listen for. These detects can also be filtered from their raw JSON
            format or reduced down to a true or false value. There can even be
            multiple recipients - one brow movement could flip a switch in
            Austin and control a robot in Alberta. That's exactly what we did.
            We controlled{' '}
            <a
              href="https://www.switch-bot.com/"
              rel="noreferrer"
              target="_blank"
            >
              SwitchBot
            </a>{' '}
            with{' '}
            <a href="https://ifttt.com/home" rel="noreferrer" target="_blank">
              IFTTT
            </a>{' '}
            , LEDs with Arduino, and{' '}
            <a href="https://sphero.com/" rel="noreferrer" target="_blank">
              Sphero
            </a>{' '}
            with Raspberry Pi.
            <br />
            <br />
            The backend, frontend, and the python scripts were created in this
            hackathon. The python scripts include new gesture classifications,
            web interfaces to send and receive webhooks,. References to the code
            can be found{' '}
            <a
              href="https://github.com/RascalToads/natHack_2021"
              rel="noreferrer"
              target="_blank"
            >
              here
            </a>
            .
          </Typography>
        )}
      </Box>
      <Typography variant="h5">
        {awaitingContextSelection
          ? 'Please select a context'
          : 'Begin Configuration'}
      </Typography>
      <Selection
        onChange={onChange}
        helperText="Select a Context"
        options={availableContext}
        title="Context"
        value={context?.id ?? ''}
      />
      {awaitingContextSelection ? (
        <Loader pending={!!context.id} />
      ) : (
        <ConfigurationForm context={context} setContext={setContext} />
      )}
    </Container>
  );
};

export default WebhookConfigurator;
