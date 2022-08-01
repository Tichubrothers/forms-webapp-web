import FileBase64 from "react-file-base64";
import { Button, Form, FormGroup, Label, FormText, Input } from "reactstrap";
import React, { useState } from "react";

const Upload = () => {
  const [confirmation, setConfirmation] = useState("Ready for lift off!");
  const [isLoading, setIsLoading] = useState("");
  const [files, setFiles] = useState("");
  const [invoice, setInvoice] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [vendor, setVendor] = useState("");
  const [description, setDescription] = useState("");

  const handleChange = (event) => {
    event.preventDefault();
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({ name: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setConfirmation("Uploading...");
  };

  const getFiles = async (files) => {
    setIsLoading("Extracting data");
    setFiles(files);

    const UID = Math.round(1 + Math.random() * (1000000 - 1));

    var data = {
      fileExt: "png",
      imageID: UID,
      folder: UID,
      img: files[0].base64,
    };

    setConfirmation("Processing...");
    await fetch(
      "https://u32gj144u4.execute-api.us-west-1.amazonaws.com/Production",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application.json",
        },
        body: JSON.stringify(data),
      }
    );

    const targetImage = UID + ".png";
    const response = await fetch(
      "https://u32gj144u4.execute-api.us-west-1.amazonaws.com/Production/ocr",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application.json",
        },
        body: JSON.stringify(targetImage),
      }
    );

    const OCRBody = await response.json();
    console.log("OCRBody", OCRBody);
    setAmount(OCRBody.body[0]);
    setInvoice(OCRBody.body[1]);
    setDate(OCRBody.body[2]);
    setConfirmation("Data loaded");
  };

  return (
    <div className="row">
      <div className="col-6 offset-3">
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <h3 className="text-danger">{confirmation}</h3>
            <h6>Upload invoice</h6>
            <FormText color="muted">PNG, JPG</FormText>
            <div className="form-group files color">
              <FileBase64 multiple={true} onDone={getFiles.bind(this)} />
            </div>
          </FormGroup>

          <FormGroup>
            <Label>
              <h6>Amount ($)</h6>
            </Label>
            <Input
              type="text"
              name="Amount"
              id="amount"
              required
              value={amount}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <h6>Invoice</h6>
            </Label>
            <Input
              type="text"
              name="Invoice"
              id="invoice"
              required
              value={invoice}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <h6>Date</h6>
            </Label>
            <Input
              type="text"
              name="Date"
              id="date"
              required
              value={date}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <h6>Vendor</h6>
            </Label>
            <Input
              type="text"
              name="Vendor"
              id="vendor"
              required
              value={vendor}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <h6>Description</h6>
            </Label>
            <Input
              type="text"
              name="Description"
              id="Description"
              required
              value={description}
              onChange={handleChange}
            />
          </FormGroup>
          <Button className="btn btn-lg btn-block btn-success">Submit</Button>
        </Form>
      </div>
    </div>
  );
};

export default Upload;
