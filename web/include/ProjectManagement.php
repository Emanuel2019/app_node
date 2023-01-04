<?php
require "DBController.php";
class ProjectManagement {
    function getProjectTaskByStatus($statusId, $projectName) {
        $db_handle = new DBController();
        $query = "SELECT * FROM tbl_task WHERE status_id= ? AND project_name = ? order by created_at asc";
        $result = $db_handle->runQuery($query, 'is', array($statusId, $projectName));
        return $result;
    }
    
    function getAllStatus() {
        $db_handle = new DBController();
        $query = "SELECT * FROM tbl_status";
        $result = $db_handle->runBaseQuery($query);
        return $result;
    }
    
    function editTaskStatus($status_id, $task_id) {
        $db_handle = new DBController();
		if($status_id==1){
			$reason ='Sem motivo de rejeição,a proposta está no estado recente';

		}
		else if($status_id==2){
			$reason ='Sem motivo de rejeição, a proposta foi Enviada';	
		}
		else if($status_id==3){
			$reason ='Sem motivo de rejeição, a proposta está em análise';
		}
		else if($status_id==4){
			$reason='Sem motivo de rejeição, a proposta foi aprovada';
		}
        $query = "UPDATE tbl_task SET status_id = ?,reason='$reason' WHERE id = ?";
        $result = $db_handle->update($query, 'ii', array($status_id, $task_id));
        return $result;
    }
}
?>
