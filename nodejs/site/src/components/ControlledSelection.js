import { Controller } from 'react-hook-form';
import Selection from './Selection';

const ControlledSelection = (props) => {
  const {
    rules,
    control,
    title,
    tag = title?.toLowerCase(),
    value = '',
  } = props;
  return (
    <Controller
      name={tag}
      control={control}
      defaultValue={value}
      rules={rules}
      render={({ field }) => {
        const formBag = field;
        delete formBag.ref;
        return <Selection {...props} {...formBag} />;
      }}
    />
  );
};

export default ControlledSelection;
