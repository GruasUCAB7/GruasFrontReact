import React from "react";

const DriverDocumentGallery = ({ documents, onClose }) => {
  const documentTitles = [
    "Licencia de Conducir",
    "Documento de Identidad",
    "Certificado Médico Vial",
    "Seguro de Responsabilidad Civil",
  ];

  if (!documents || documents.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Documentos del Conductor
          </h2>
          <p className="text-gray-700">No hay documentos disponibles.</p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Documentos del Conductor
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((url, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {documentTitles[index] || `Documento ${index + 1}`}
              </h3>
              <img
                src={url}
                alt={documentTitles[index] || `Documento ${index + 1}`}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition text-lg font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverDocumentGallery;