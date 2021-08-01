import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import ControlledSelection from './ControlledSelection';
import Endpoints from './Endpoints';
import { useFieldArray } from 'react-hook-form';
import {
  ACTION_OPTIONS,
  BOOLEAN,
  VALUE_OPTIONS,
  VALUE_TYPE_OPTIONS,
} from '../constants';

const ActionRows = (props) => {
  const { actions, ...rest } = props;
  const { control } = props;

  const { fields, append } = useFieldArray({
    control,
    name: 'data',
  });

  return (
    <>
      {fields.map((row, index) => (
        <Row key={index} {...rest} {...row} append={append} index={index} />
        // your boat
      ))}
      <Button
        aria-label="add"
        color="primary"
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => append({ endpoints: [{}] })}
      >
        Add
      </Button>
    </>
  );
};

const Row = (props) => {
  const { control, data, index } = props;
  // TODO: consume error texts
  // const { errors } = props;
  // const error = errors[index];

  return (
    <Container>
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
      {/* TODO: use watch to check this value */}
      {data?.valueType === BOOLEAN && (
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
      <Endpoints control={control} index={index} />
    </Container>
  );
};

export default ActionRows;
