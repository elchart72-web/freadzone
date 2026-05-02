terraform {
  required_providers {
    null = { source = "hashicorp/null" version = "~> 3.0" }
  }
}

variable "project_dir" {
  default = "C:/Freadzone"
}

resource "null_resource" "freadzone_deploy" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command     = "docker compose up -d --build"
    working_dir = var.project_dir
    interpreter = ["PowerShell", "-Command"]
  }
}

resource "null_resource" "freadzone_backup" {
  triggers = { daily = formatdate("YYYY-MM-DD", timestamp()) }

  provisioner "local-exec" {
    command     = "./deploy.sh backup"
    working_dir = var.project_dir
    interpreter = ["PowerShell", "-Command"]
  }

  depends_on = [null_resource.freadzone_deploy]
}

output "status" {
  value = "FreadZone deployed at ${timestamp()}"
}
