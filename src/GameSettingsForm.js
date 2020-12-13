import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function GameSettingsForm(props) {
  return (
    <Form>
      <Form.Row>
        <Form.Group as={Col} controlId='gameSettingsFormRows'>
          <Form.Label>Rows</Form.Label>
          <Form.Control
            type='text'
            value={props.values.rows}
            onChange={props.events.rowsChange}
          />
        </Form.Group>
        <Form.Group as={Col} controlId='gameSettingsFormColumns'>
          <Form.Label>Columns</Form.Label>
          <Form.Control
            type='text'
            value={props.values.cols}
            onChange={props.events.colsChange}
          />
        </Form.Group>
        <Form.Group as={Col} controlId='gameSettingsFormBombs'>
          <Form.Label>Bombs</Form.Label>
          <Form.Control
            type='text'
            value={props.values.bombs}
            onChange={props.events.bombsChange}
          />
        </Form.Group>
        <Col className='d-flex align-items-end mb-3'>
          <Button
            variant='outline-primary'
            className='w-100'
            onClick={props.events.startClick}
          >
            Start
          </Button>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          {props.message}
        </Col>
      </Form.Row>
    </Form>
  );
}

export default GameSettingsForm;
