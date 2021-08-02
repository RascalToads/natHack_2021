import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { CONTEXTS } from '../constants';
import { db } from '../firebase';
import ActionRows from './ActionRows';

const ConfigurationForm = (props) => {
  const { context, setContext } = props;
  const { control, handleSubmit, watch } = useForm({
    defaultValues: { ...context, data: context?.data ?? [{ endpoints: [{}] }] },
  });
  const styles = useStyles();

  const onSubmit = ({ data }) => {
    const doc = db.doc(`${CONTEXTS}/${context.id}`);
    const payload = {
      id: context.id,
      name: context.name,
      data,
    };
    doc
      .set(payload)
      .then(() => setContext({ id: context.id, name: context.name }));
  };

  const actions = Object.values(context?.data ?? {});

  // TODO: HANDLE ERRORS
  return (
    <Paper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ActionRows actions={actions} control={control} watch={watch} />
        <Divider />
        <Button
          className={styles.submitButton}
          color="primary"
          type="submit"
          variant="contained"
        >
          SAVE
        </Button>
      </form>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  submitButton: {
    float: 'right',
    marginTop: theme.spacing(2),
  },
}));

export default ConfigurationForm;
