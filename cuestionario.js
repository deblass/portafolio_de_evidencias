$(document).ready(function () {
    $("#evaluarBtn").click(function () {
        let total = 0;
        let respuestasDetalle = "";
        $("select").each(function () {
            let preguntaTexto = $(this).closest(".pregunta").find("label").text();
            let respuestaTexto = $(this).find("option:selected").text();
            respuestasDetalle += `${preguntaTexto}: ${respuestaTexto}\n`;
            total += parseInt($(this).val()) || 0; 
        });
        let mensaje = "";
        if (total >= 80) {
            mensaje = "✅ ¡Tu empresa tiene una seguridad excelente!";
        } else if (total >= 50) {
            mensaje = "⚠️ Tu empresa tiene buena seguridad, pero aún necesita mejoras.";
        } else {
            mensaje = "🚨 Tu empresa está en riesgo. Debes implementar mejores medidas de seguridad.";
        }

        if ($("#resultado").length === 0) {
            $("#formulario").append('<p id="resultado"></p>');
        }

        $("#resultado").html(mensaje);
        window.respuestasCuestionario = respuestasDetalle; 
    });

    $("#pdfBtn").click(function () {
        let resultado = $("#resultado").html() || ""; 
        let respuestas = window.respuestasCuestionario || "";

        if (!resultado.trim()) {
            alert("⚠️ Evalúa la seguridad antes de generar el PDF.");
            return;
        }
        const { jsPDF } = window.jspdf;
        let doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4" 

        })
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Comprobante de Evaluación de Seguridad", 10, 20);
        doc.setFontSize(12);
        doc.text("Fecha: " + new Date().toLocaleDateString(), 10, 30);
        doc.text("Resultado:", 10, 50);
        doc.text(resultado, 10, 60);
        doc.text("Respuestas:", 10, 80);
        let yPos = 90;
        respuestas.split("\n").forEach((linea) => {
            if (linea.trim()) {
                doc.text(linea, 10, yPos);
                yPos += 8;
            }
        });
        $("#visorPDF").attr("src", "");
        setTimeout(() => {
            $("#visorPDF").attr("src", doc.output("bloburl"));
        }, 100);
    });
});
