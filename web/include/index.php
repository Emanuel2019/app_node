<?php
require_once "ProjectManagement.php";

$projectName = "StartTuts";
$projectManagement = new ProjectManagement();
$statusResult = $projectManagement->getAllStatus();
?>
<style>
	.task-board {
    background: #fff;
    display: inline-block;
    padding: 12px;
    border-radius: 3px;
    width: 100%;
    white-space: nowrap;

    
}

.status-card {
    width: 250px;
    margin-right: 8px;
	color: #fff;
    border-radius: 3px;
    display: inline-block;
    vertical-align: top;
    font-size: 0.9em;
}

.status-card:last-child {
    margin-right: 0px;
}

.card-header {
    width: 100%;
    padding: 10px 10px 0px 10px;
    box-sizing: border-box;
    border-radius: 3px;
    display: block;
    font-weight: bold;
}

.card-header-text {
    display: block;
}

ul.sortable {
    padding-bottom: 10px;
}

ul.sortable li:last-child {
    margin-bottom: 0px;
}

ul {
    list-style: none;
    margin: 0;
    padding: 0px;
}

.text-row {
    padding: 15px 10px;
    margin: 10px;
    background: #fff;
    box-sizing: border-box;
    border-radius: 3px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    font-size: 0.8em;
    white-space: normal;
    line-height: 20px;
    color: #000;
	font-weight: bold;
    text-transform: uppercase;
}

.ui-sortable-placeholder {
    visibility: inherit !important;
    background: transparent;
    border: #fff 2px dashed;
}

</style>

<main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
        <h1 class="h2 text-primary"> <i class="fa fa-database" aria-hidden="true"></i><?=$title?></h1>
		<div class=" text-end">
	
		<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#userModal">
				<i class="fa fa-plus-circle" aria-hidden="true"></i>
				Registar negócio
				</button>
			
</div>
      </div>
		
	  <div class="task-board container">
            <?php
            foreach ($statusResult as $statusRow) {
                $taskResult = $projectManagement->getProjectTaskByStatus($statusRow["id"], $projectName);
                ?>
                <div class="status-card bg-dark">
                    <div class="card-header">
                        <strong class="card-header-text"><?php echo $statusRow["status_name"]; ?></strong>
                    </div>
                    <ul class="sortable ui-sortable list-group"
                        id="sort<?php echo $statusRow["id"]; ?>"
                        data-status-id="<?php echo $statusRow["id"]; ?>">
                <?php
                if (! empty($taskResult)) {
                    foreach ($taskResult as $taskRow) {
                        ?>
                
                     <li class="text-row list-group-item d-flex justify-content-between align-items-center"
                            data-task-id="<?php echo $taskRow["id"]; ?>"><?php echo $taskRow["title"]; ?>
                            <p>

      <?php echo $taskRow["description"]; ?>
                            </p>


                            </li>
                <?php
                    }
                }
                ?>
                                                 </ul>
                </div>
                <?php
            }
            ?>
        </div>
    </main>
  </div>
</div>
<script>
 $( function() {
     var url = 'edit-status.php';
     $('ul[id^="sort"]').sortable({
         connectWith: ".sortable",
         receive: function (e, ui) {
             var status_id = $(ui.item).parent(".sortable").data("status-id");
             var task_id = $(ui.item).data("task-id");
             $.ajax({
                 url: url+'?status_id='+status_id+'&task_id='+task_id,
                 success: function(response){
                     }
             });
             }
     
     }).disableSelection();
     } );
  </script>
