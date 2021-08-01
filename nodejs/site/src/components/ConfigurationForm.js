import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import { CONTEXTS } from '../constants';
import { db } from '../firebase';
import ActionRows from './ActionRows';
import { Paper, Typography } from '@material-ui/core';

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
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>
    </Paper>
  );
};

export default ConfigurationForm;
