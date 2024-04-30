import { PDFArray, PDFDocument, PDFField, PDFName } from "pdf-lib";
import { SignatureField } from "./esignpdf-types";

export function getPageIndexOfField(
  pdfDoc: PDFDocument,
  field: PDFField
): number {
  let fieldPageIndex = -1;

  pdfDoc.getPages().forEach((aPage, index) => {
    const pageAnnotsRaw = aPage.node.lookupMaybe(
      PDFName.of("Annots"),
      PDFArray
    );

    const pageAnnots = pageAnnotsRaw ? pageAnnotsRaw.asArray() : [];
    if (pageAnnots.includes(field.ref)) {
      fieldPageIndex = index + 1;
    }
  });

  return fieldPageIndex;
}

export async function getSignatureFields(
  file: File,
  keyword: string
): Promise<SignatureField[]> {
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const fieldPositions: SignatureField[] = [];

  const form = pdfDoc.getForm();
  const fields = form.getFields();

  // Get the positions of all Text Fields
  fields.forEach((field) => {
    const widgets = field.acroField.getWidgets();
    const firstWidget = widgets[0]; // Assuming the field has at least one widget
    const fieldPosition = firstWidget.getRectangle();

    if (field.getName().toLowerCase().includes(keyword.toLowerCase())) {
      fieldPositions.push({
        page: getPageIndexOfField(pdfDoc, field),
        left: fieldPosition.x,
        top:
          pdfDoc.getPage(0).getHeight() -
          fieldPosition.y -
          fieldPosition.height,
        width: fieldPosition.width,
        height: fieldPosition.height,
      });
    }
  });

  return fieldPositions;
}
