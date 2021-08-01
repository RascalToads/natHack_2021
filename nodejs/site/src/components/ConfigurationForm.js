import { useForm } from 'react-hook-form';
import { CONTEXTS } from '../constants';
import { db } from '../firebase';
import ActionRows from './ActionRows';

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

  console.log('in form context is', context);
  const actions = Object.values(context?.data ?? {});

  // TODO: HANDLE ERRORS
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ActionRows actions={actions} control={control} watch={watch} />

      <input type="submit" />
    </form>
  );
};

export default ConfigurationForm;
