# ece-devops-projet
## Contributors

- MASSINE AGHARMIOU
- FODERE Vincent
- RAHEM Massinissa

## Partie 01

### Création d'une application web

Pour cette partie, on a utilisé node js comme langage de programmations et MySql/Redis comme base de données où seront stockées nos données.

## Partie 02
### CI/CD pipeline

## Partie 03
### Configure and provision a virtual environment - run l'application avec l'approche IaC

Prérequis : avoir virtualbox, vagrant, le plugin vagrant "vagrant-vbguest".
Pour test IaC entrer la commande :
```vagrant up``` 
-> ensuite check sur localhost:1234
Toutes les installations sont faites directement dans le playbook install et vagrantfile.
Pour le healthcheck il faut ouvrir un autre terminal et faire vagrant ssh, puis entrer la commande :
```ansible-playbook /vagrant/playbooks/run.yml --tags healthchecks -i /tmp/vagrant-ansible/inventory/vagrant_ansible_local_inventory```

## Partie 04
### Construire une image Docker de notre application

## Partie 05
### Orchestration des containers avec Docker Compose

