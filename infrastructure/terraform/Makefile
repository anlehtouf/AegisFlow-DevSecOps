# AegisFlow Terraform — convenience targets
#
# Usage:
#   make init        — terraform init
#   make plan        — terraform plan
#   make apply       — terraform apply (asks for confirmation)
#   make destroy     — terraform destroy (asks twice)
#   make fmt         — format all .tf files
#   make validate    — syntax + provider validation
#   make sec         — run tfsec
#   make all-checks  — fmt + validate + sec (use in pre-commit)

.PHONY: init plan apply destroy fmt validate sec all-checks output

init:
	terraform init

plan:
	terraform plan -out=tfplan

apply:
	terraform apply tfplan

destroy:
	@echo "About to destroy ALL AegisFlow infrastructure."
	@echo "Type 'yes' to confirm at the prompt."
	terraform destroy

fmt:
	terraform fmt -recursive

validate:
	terraform validate

sec:
	tfsec . --config-file .tfsec.yml

all-checks: fmt validate sec
	@echo "All checks passed."

output:
	terraform output -json | tee outputs.json
