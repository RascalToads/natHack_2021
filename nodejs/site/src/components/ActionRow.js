import { useWatch } from 'react-hook-form';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import {
  ACTION_OPTIONS,
  BOOLEAN,
  VALUE_OPTIONS,
  VALUE_TYPE_OPTIONS,
} from '../constants';
import ControlledSelection from './ControlledSelection';
import Endpoints from './Endpoints';

const ActionRow = (props) => {
  const { control, data, index } = props;
  // TODO: consume error texts
  // const { errors } = props;
  // const error = errors[index];
  const styles = useStyles();
  const valueType = useWatch({ control, name: `data.${index}.valueType` });
  return (
    <Container className={styles.actionRow}>
      <Box className={styles.actionConfig}>
        <ControlledSelection
          control={control}
          rules={{ required: true }}
          helperText="Select an action"
          options={ACTION_OPTIONS}
          title={`Action ${index + 1}`}
          tag={`data.${index}.action`}
          value={data?.action ?? ''}
        />
        <ControlledSelection
          control={control}
          rules={{ required: true }}
          helperText="Select a value type"
          options={VALUE_TYPE_OPTIONS}
          title="Value Type"
          tag={`data.${index}.valueType`}
          value={data?.valueType ?? ''}
        />
        {valueType === BOOLEAN && (
          <ControlledSelection
            control={control}
            rules={{ required: true }}
            helperText="Select value to receive"
            options={VALUE_OPTIONS}
            title="Value"
            tag={`data.${index}.value`}
            value={data?.value ?? ''}
          />
        )}
      </Box>
      <Endpoints control={control} index={index} />
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  actionConfig: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > div': {
      marginRight: theme.spacing(1),
    },
  },
}));

export default ActionRow;
