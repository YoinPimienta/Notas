<?php
header('Content-Type: application/json');
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $conn->query("SELECT * FROM notes ORDER BY updated_at DESC");
        $notes = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($notes);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $title = $data['title'] ?? 'Nueva Nota';
        $content = $data['content'] ?? '';

        $stmt = $conn->prepare("INSERT INTO notes (title, content) VALUES (?, ?)");
        $stmt->bind_param('ss', $title, $content);
        $stmt->execute();
        echo json_encode(['id' => $conn->insert_id, 'title' => $title, 'content' => $content]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];
        $content = $data['content'];

        $stmt = $conn->prepare("UPDATE notes SET content = ?, updated_at = NOW() WHERE id = ?");
        $stmt->bind_param('si', $content, $id);
        $stmt->execute();
        echo json_encode(['message' => 'Nota actualizada']);
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? null;
        if ($id) {
            $stmt = $conn->prepare("DELETE FROM notes WHERE id = ?");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            echo json_encode(['message' => 'Nota eliminada']);
        } else {
            echo json_encode(['error' => 'ID no proporcionado']);
        }
        break;

    default:
        echo json_encode(['error' => 'Método no soportado']);
        break;
}
?>
