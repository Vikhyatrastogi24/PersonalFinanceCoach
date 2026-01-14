import { useState } from "react";
import Papa from "papaparse";
import { Button, Card, Input, Select } from "../ui";
import transactionService from "../../api/transactionService";
import ToastNotification from "../notifications/ToastNotification";

const TRANSACTION_FIELDS = [
  { label: "Date", value: "date" },
  { label: "Description", value: "description" },
  { label: "Category", value: "category" },
  { label: "Amount", value: "amount" },
  { label: "Type (income/expense)", value: "type" },
];

export default function TransactionUploader() {
  const [file, setFile] = useState(null);
  const [rawData, setRawData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });

  // Parse CSV file, extract headers and first few rows for preview
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);

    Papa.parse(selected, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cols = results.meta.fields || [];
        setHeaders(cols);
        setRawData(results.data);
        setPreview(results.data.slice(0, 10)); // Preview first 10 rows
        setMapping({}); // Reset mappings for new file
      },
      error: () =>
        setToast({
          open: true,
          message: "Failed to parse file",
          type: "error",
        }),
    });
  };

  // Update mapping CSV column -> transaction field
  const handleMappingChange = (csvCol, txField) => {
    setMapping((prev) => ({ ...prev, [csvCol]: txField }));
  };

  // Transform raw CSV data using mapping before upload
  const transformData = () => {
    return rawData.map((row) => {
      const tx = {};
      for (const [csvCol, txField] of Object.entries(mapping)) {
        if (txField && txField !== "ignore") {
          tx[txField] = row[csvCol];
        }
      }
      return tx;
    });
  };

  // Validate required fields mapped and upload transformed data
  const handleUpload = async () => {
    const requiredFields = ["date", "description", "amount", "type"];
    for (const field of requiredFields) {
      if (!Object.values(mapping).includes(field)) {
        setToast({
          open: true,
          message: `Please map the "${field}" field.`,
          type: "error",
        });
        return;
      }
    }

    setUploading(true);
    try {
      const transformed = transformData();
      await transactionService.uploadTransactions(transformed);
      setToast({
        open: true,
        message: "Transactions uploaded successfully!",
        type: "success",
      });
      // Reset all states to clear form
      setFile(null);
      setRawData([]);
      setHeaders([]);
      setMapping({});
      setPreview([]);
    } catch (e) {
      setToast({
        open: true,
        message: "Upload failed, please try again.",
        type: "error",
      });
    }
    setUploading(false);
  };

  return (
    <section className="max-w-3xl mx-auto mt-6 px-2">
      <Card className="shadow-xl rounded-xl p-6 bg-base-100">
        <h2 className="text-2xl mb-2 font-bold">Upload Transactions</h2>
        <p className="text-muted text-sm mb-6">
          Upload your CSV and map its columns.
        </p>

        {/* File input */}
        <label className="w-full cursor-pointer flex flex-col items-center p-6 border-2 border-dashed border-primary rounded-xl bg-base-200 hover:bg-primary/10 transition-colors mb-6">
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="text-xl mb-2">
            📥 Drag & drop CSV here or click to select
          </span>
          <span className="badge badge-outline badge-lg">
            {file ? `Selected: ${file.name}` : "No file selected"}
          </span>
        </label>

        {/* Mapping UI */}
        {headers.length > 0 && (
          <>
            <h3 className="font-semibold text-lg mb-2">
              Map CSV columns to transaction fields
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {headers.map((csvCol) => (
                <div key={csvCol} className="flex flex-col">
                  <label className="mb-1 font-medium text-sm">{csvCol}</label>
                  <Select
                    value={mapping[csvCol] || ""}
                    onChange={(e) =>
                      handleMappingChange(csvCol, e.target.value)
                    }
                    className="select select-bordered"
                  >
                    <option value="">-- Select field --</option>
                    {TRANSACTION_FIELDS.map((field) => (
                      <option key={field.value} value={field.value}>
                        {field.label}
                      </option>
                    ))}
                    <option value="ignore">Ignore column</option>
                  </Select>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Preview */}
        {preview.length > 0 && (
          <div className="overflow-x-auto bg-base-200 p-4 rounded-lg shadow-sm mb-6">
            <h3 className="text-base font-semibold mb-2">
              Data Preview (first 10 rows)
            </h3>
            <table className="w-full table table-xs">
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, idx) => (
                  <tr key={idx}>
                    {headers.map((col) => (
                      <td key={col}>{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Upload button */}
        <Button
          className="btn btn-primary"
          disabled={uploading || !file || headers.length === 0}
          onClick={handleUpload}
        >
          {uploading ? "Uploading..." : "Upload Transactions"}
        </Button>

        {/* Toast notifications */}
        <ToastNotification
          open={toast.open}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, open: false })}
        />
      </Card>
    </section>
  );
}
