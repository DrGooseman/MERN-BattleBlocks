import React from "react";

import Button from "react-bootstrap/Button";

function AddUserBubble(props) {
  return (
    <div className="new-chat-modal-added-user">
      {props.user.username}
      <Button
        variant="outline-primary"
        onClick={() => props.handleRemoveUser(props.user.username)}
      >
        X
      </Button>
    </div>
  );
}

export default AddUserBubble;
