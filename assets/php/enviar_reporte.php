<?php
require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ===== CONFIGURACIÓN INICIAL CRÍTICA ===== //
ini_set('upload_max_filesize', '20M');
ini_set('post_max_size', '22M');
ini_set('max_execution_time', '300');
ini_set('max_input_time', '300');
ini_set('memory_limit', '256M');

// Verificar directorio temporal
$temp_dir = ini_get('upload_tmp_dir') ?: sys_get_temp_dir();
if (!is_writable($temp_dir)) {
    error_log("Error: Directorio temporal no tiene permisos de escritura: $temp_dir");
    header('Location: ../../generic.html?status=error&message='.urlencode('Error en configuración del servidor'));
    exit;
}

// ===== DEPURACIÓN DE ARCHIVOS RECIBIDOS ===== //
error_log("==== INICIO DE DEPURACIÓN DE ARCHIVOS ====");
if (empty($_FILES['imagenes']['name'][0])) {
    error_log("No se recibieron archivos adjuntos");
} else {
    foreach ($_FILES['imagenes']['tmp_name'] as $key => $tmp_name) {
        $error = $_FILES['imagenes']['error'][$key];
        $file_info = [
            'Nombre' => $_FILES['imagenes']['name'][$key],
            'Tamaño' => $_FILES['imagenes']['size'][$key] . ' bytes',
            'Tipo' => $_FILES['imagenes']['type'][$key],
            'Temporal' => $tmp_name,
            'Error' => $error
        ];
        
        if ($error !== UPLOAD_ERR_OK) {
            error_log("Error en archivo #$key: " . getUploadError($error));
        } elseif (!file_exists($tmp_name)) {
            error_log("Archivo temporal #$key no existe: $tmp_name");
        } else {
            error_log("Archivo #$key válido: " . print_r($file_info, true));
        }
    }
}

// ===== CONFIGURACIÓN DE PHPMailer PARA GMAIL ===== //
try {
    $mail = new PHPMailer(true);
    
    // Configuración SMTP para Gmail
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com'; // Servidor SMTP de Gmail
    $mail->SMTPAuth = true;
    $mail->Username = 'ejva04@gmail.com'; // Tu dirección de envío de Gmail
    $mail->Password = 'ckhm vzdk vdun eeuq'; // La contraseña de tu cuenta de Gmail
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // SSL para Gmail
    $mail->Port = 465; // Puerto para Gmail con SSL
    $mail->CharSet = 'UTF-8';
    
    // Configuración para adjuntos
    $mail->AllowEmpty = false;
    $mail->Timeout = 30;
    $mail->SMTPKeepAlive = true;

    // Configuración del correo
    $mail->setFrom('ejva04@gmail.com', 'MiBarrioApp');
    $mail->addAddress('ejva08@gmail.com'); // Nuevo destinatario
    
    // Procesar datos del formulario
    $anonimo = $_POST['anonimo'] ?? 'no';
    $nombre = ($anonimo === 'si') ? 'Anónimo' : ($_POST['name'] ?? '');
    $email = ($anonimo === 'si') ? 'anonimo@mibarrioapp.com' : ($_POST['email'] ?? '');
    $problema = $_POST['problema'] ?? '';
    $tipoProblema = [
        'basura' => 'Acumulación de basura',
        'alumbrado' => 'Alumbrado público dañado',
        'calle' => 'Huecos o baches en la vía',
        'agua' => 'Fuga de agua potable',
        'parque' => 'Daños en áreas verdes',
        'otro' => 'Otro tipo de problema'
    ][$problema] ?? $problema;

    // Versión de texto plano
    $mail->AltBody = "Nuevo Reporte\n\n"
                   . "Nombre: $nombre\n"
                   . "Email: $email\n"
                   . "Tipo de problema: $tipoProblema\n"
                   . "Ubicación: " . ($_POST['ubicacion'] ?? '') . "\n"
                   . "Descripción: " . ($_POST['descripcion'] ?? '');

    // Versión HTML
    $mail->isHTML(true);
    $mail->Subject = 'Nuevo Reporte: ' . $tipoProblema;
    $mail->Body = buildEmailBody($nombre, $email, $tipoProblema, $_POST['ubicacion'] ?? '', $_POST['descripcion'] ?? '');

    // ===== ADJUNTAR ARCHIVOS ===== //
    if (!empty($_FILES['imagenes']['name'][0])) {
        foreach ($_FILES['imagenes']['tmp_name'] as $key => $tmp_name) {
            if ($_FILES['imagenes']['error'][$key] === UPLOAD_ERR_OK) {
                $file_name = cleanFileName($_FILES['imagenes']['name'][$key]);
                $file_tmp = $_FILES['imagenes']['tmp_name'][$key];
                
                // Verificar tipo MIME real
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $mime = finfo_file($finfo, $file_tmp);
                finfo_close($finfo);
                
                if (strpos($mime, 'image/') === 0) {
                    if (!$mail->addAttachment($file_tmp, $file_name)) {
                        error_log("Fallo al adjuntar: $file_name");
                    } else {
                        error_log("Adjunto exitoso: $file_name");
                    }
                } else {
                    error_log("Tipo de archivo no permitido: $mime");
                }
            }
        }
    }

    // Enviar correo
    $mail->send();
    error_log("Correo enviado exitosamente con " . count($mail->getAttachments()) . " adjuntos");
    header('Location: ../../generic.html?status=success');
    exit;
    
} catch (Exception $e) {
    error_log('Error al enviar correo: ' . $e->getMessage());
    header('Location: ../../generic.html?status=error&message=' . urlencode('Error al enviar el reporte: ' . $e->getMessage()));
    exit;
}

// ===== FUNCIONES AUXILIARES ===== //
function getUploadError($code) {
    $errors = [
        UPLOAD_ERR_INI_SIZE => 'El archivo excede el tamaño máximo permitido',
        UPLOAD_ERR_FORM_SIZE => 'El archivo excede el tamaño máximo del formulario',
        UPLOAD_ERR_PARTIAL => 'El archivo solo se subió parcialmente',
        UPLOAD_ERR_NO_FILE => 'No se subió ningún archivo',
        UPLOAD_ERR_NO_TMP_DIR => 'Falta el directorio temporal',
        UPLOAD_ERR_CANT_WRITE => 'No se pudo escribir el archivo en disco',
        UPLOAD_ERR_EXTENSION => 'Una extensión de PHP detuvo la subida'
    ];
    return $errors[$code] ?? "Error desconocido (Código: $code)";
}

function cleanFileName($filename) {
    return mb_ereg_replace("([^\w\s\d\-_~,;\[\]\(\).])", '', $filename);
}

function buildEmailBody($nombre, $email, $problema, $ubicacion, $descripcion) {
    return '
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; padding: 20px;">
        <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Nuevo Reporte</h2>
        <p><strong style="color: #555;">Nombre:</strong> ' . htmlspecialchars($nombre) . '</p>
        <p><strong style="color: #555;">Email:</strong> ' . htmlspecialchars($email) . '</p>
        <p><strong style="color: #555;">Tipo de problema:</strong> ' . htmlspecialchars($problema) . '</p>
        <p><strong style="color: #555;">Ubicación:</strong> ' . htmlspecialchars($ubicacion) . '</p>
        <div style="margin-top: 15px;">
            <strong style="color: #555; display: block; margin-bottom: 5px;">Descripción:</strong>
            <div style="background: #f9f9f9; padding: 10px; border-radius: 4px;">'
                . nl2br(htmlspecialchars($descripcion)) . '
            </div>
        </div>
    </div>';
}