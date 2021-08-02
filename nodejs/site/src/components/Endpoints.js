import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import ControlledSelection from './ControlledSelection';
import ControlledTextField from './ControlledTextField';
import { useFieldArray } from 'react-hook-form';
import { MODE_OPTIONS } from '../constants';

const Endpoints = (props) => {
  const { control, index } = props;
  const { append, fields, remove } = useFieldArray({
    control,
    name: `data.${index}.endpoints`,
  });
  const styles = useStyles();

  return (
    <Box className={styles.endpointsBox}>
      {fields.map((endpoint, selfIndex) => (
        <Box className={styles.endpoint}>
          <Endpoint
            key={selfIndex}
            {...props}
            {...endpoint}
            selfIndex={selfIndex}
          />
          <Box className={styles.endpointEdits}>
            {selfIndex === fields.length - 1 && (
              <Button
                aria-label="add"
                color="primary"
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => append({})}
              >
                Add
              </Button>
            )}
            <Button
              aria-label="remove"
              color="primary"
              startIcon={<RemoveIcon />}
              variant="contained"
              disabled={fields.length < 2}
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const Endpoint = (props) => {
  const { control, data, index, selfIndex } = props;
  // TODO: consume error texts
  // const { errors } = props;
  // const error = errors[index];

  return (
    <>
      <ControlledTextField
        control={control}
        rules={{ required: true }} // TODO: format!
        helperText="Enter a url"
        title={`Endpoint ${index + 1}`}
        tag={`data.${index}.endpoints.${selfIndex}.url`}
        value={data?.endpoint ?? ''}
      />
      <ControlledSelection
        control={control}
        rules={{ required: true }}
        helperText="POST or GET Hook"
        options={MODE_OPTIONS}
        title="Method"
        tag={`data.${index}.endpoints.${selfIndex}.mode`}
        value={data?.mode ?? ''}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  endpointsBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: 'fit-content',
  },
  endpoint: {
    display: 'flex',
    justifyContent: 'space-between',
    width: 'fit-content',
    '& > div, & > button': {
      marginLeft: theme.spacing(1),
    },
  },
  endpointEdits: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& > button': {
      marginLeft: theme.spacing(1),
      height: 'fit-content',
    },
  },
}));

export default Endpoints;
