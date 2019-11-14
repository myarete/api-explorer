const React = require('react');
const PropTypes = require('prop-types');
const Form = require('react-jsonschema-form').default;
const UpDownWidget = require('react-jsonschema-form/lib/components/widgets/UpDownWidget').default;
const TextWidget = require('react-jsonschema-form/lib/components/widgets/TextWidget').default;
const DateTimeWidget = require('react-jsonschema-form/lib/components/widgets/DateTimeWidget')
  .default;
const Oas = require('oas');
const { parametersToJsonSchema } = require('oas/utils');

const DescriptionField = require('./form-components/DescriptionField');
const createBaseInput = require('./form-components/BaseInput');
const createSelectWidget = require('./form-components/SelectWidget');
const createArrayField = require('./form-components/ArrayField');
const createSchemaField = require('./form-components/SchemaField');
const createTextareaWidget = require('./form-components/TextareaWidget');
const createFileWidget = require('./form-components/FileWidget');
const createURLWidget = require('./form-components/URLWidget');

const { Operation } = Oas;

function Params({
  oas,
  operation,
  formData,
  onChange,
  onSubmit,
  BaseInput,
  SelectWidget,
  ArrayField,
  SchemaField,
  TextareaWidget,
  FileWidget,
  URLWidget,
}) {
  const jsonSchema = parametersToJsonSchema(operation, oas);

  return (
    jsonSchema &&
    jsonSchema.map(schema => {
      return [
        <div key={`${schema.type}-header`} className="param-type-header">
          <h3>{schema.label}</h3>
          <div className="param-header-border" />
        </div>,
        <Form
          key={`${schema.type}-form`}
          fields={{
            DescriptionField,
            ArrayField,
            SchemaField,
          }}
          formData={formData[schema.type]}
          id={`form-${operation.operationId}`}
          idPrefix={operation.operationId}
          onChange={form => {
            return onChange({ [schema.type]: form.formData });
          }}
          onSubmit={onSubmit}
          schema={schema.schema}
          widgets={{
            int8: UpDownWidget,
            uint8: UpDownWidget,
            int16: UpDownWidget,
            uint16: UpDownWidget,
            int32: UpDownWidget,
            uint32: UpDownWidget,
            int64: UpDownWidget,
            uint64: UpDownWidget,
            double: UpDownWidget,
            float: UpDownWidget,
            binary: FileWidget,
            byte: TextWidget,
            string: TextWidget,
            uuid: TextWidget,
            duration: TextWidget,
            dateTime: DateTimeWidget,
            integer: UpDownWidget,
            json: TextareaWidget,
            url: URLWidget,
            BaseInput,
            SelectWidget,
          }}
        >
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button style={{ display: 'none' }} type="submit" />
        </Form>,
      ];
    })
  );
}

Params.propTypes = {
  ArrayField: PropTypes.func.isRequired,
  BaseInput: PropTypes.func.isRequired,
  FileWidget: PropTypes.func.isRequired,
  formData: PropTypes.shape({}).isRequired,
  oas: PropTypes.instanceOf(Oas).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  operation: PropTypes.instanceOf(Operation).isRequired,
  SchemaField: PropTypes.func.isRequired,
  SelectWidget: PropTypes.func.isRequired,
  TextareaWidget: PropTypes.func.isRequired,
};

function createParams(oas) {
  const BaseInput = createBaseInput(oas);
  const SelectWidget = createSelectWidget(oas);
  const ArrayField = createArrayField(oas);
  const SchemaField = createSchemaField();
  const TextareaWidget = createTextareaWidget(oas);
  const FileWidget = createFileWidget(oas);
  const URLWidget = createURLWidget(oas);

  return props => {
    return (
      <Params
        {...props}
        ArrayField={ArrayField}
        BaseInput={BaseInput}
        FileWidget={FileWidget}
        SchemaField={SchemaField}
        SelectWidget={SelectWidget}
        TextareaWidget={TextareaWidget}
        URLWidget={URLWidget}
      />
    );
  };
}

module.exports = createParams;
