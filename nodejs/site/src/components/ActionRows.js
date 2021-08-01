import { useFieldArray } from 'react-hook-form';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import ActionRow from './ActionRow';

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
        <ActionRow
          key={index}
          {...rest}
          {...row}
          append={append}
          index={index}
        />
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

export default ActionRows;
