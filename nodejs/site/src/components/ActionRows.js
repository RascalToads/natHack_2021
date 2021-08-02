import { useFieldArray } from 'react-hook-form';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import ActionRow from './ActionRow';
import { Container, Divider } from '@material-ui/core';

const ActionRows = (props) => {
  const { actions, ...rest } = props;
  const { control } = props;

  const { fields, append } = useFieldArray({
    control,
    name: 'data',
  });
  const styles = useStyles();

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
      <Container className={styles.addButtonContainer}>
        <Button
          aria-label="add"
          color="primary"
          className={styles.addButton}
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => append({ endpoints: [{}] })}
        >
          Add Another Action
        </Button>
      </Container>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  addButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  addButton: {
    margin: theme.spacing(2, 'auto'),
    width: '30%',
  },
}));

export default ActionRows;
