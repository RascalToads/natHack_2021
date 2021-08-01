import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
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
  return (
    <>
      {fields.map((endpoint, selfIndex) => (
        <Endpoint
          key={selfIndex}
          {...props}
          {...endpoint}
          append={append}
          selfIndex={selfIndex}
        />
      ))}
      <Button
        aria-label="add"
        color="primary"
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => append({})}
      >
        Add
      </Button>
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
    </>
  );
};

const Endpoint = (props) => {
  const { control, data, index, selfIndex } = props;
  // TODO: consume error texts
  // const { errors } = props;
  // const error = errors[index];

  return (
    <Container>
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
    </Container>
  );
};

export default Endpoints;
