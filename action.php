<?php
if(isset($_POST['submit'])){
  // For delay effect
  sleep(1);


  // For storing the error fields' name
  $errorFields = array();
  // Validate fields
  if($_POST['name']==""){
    // Array key must be the same like input name.
    $errorFields['name'] = "Please fill name!";
  }
  if($_POST['address']==""){
    // Array key must be the same like input name.
    $errorFields['address'] = "Please fill address!";
  }

  // Check error fields count
  if(count($errorFields)==0){
    // Success message
    $result['status'] = "success";
    $result['message'] = "Your data has been saved.";
    // Form will be cleared
    $result['clearForm'] = true;
  }
  else{
    // Failed message
    $result['status'] = "failed";
    $result['message'] = "Please fill all fields correctly!";
    // Form will not be cleared
    $result['clearForm'] = false;
  }

  // Error fields list
  $result['errorFields'] = $errorFields;

  // Return message and error fields is JSON format
  echo json_encode($result);
}
?>