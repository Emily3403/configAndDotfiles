#!/usr/bin/env bash

if [ -z "$VM_PASSWORD" ]
then
  extra_params="-K"
else
  extra_params="--extra-vars \"ansible_become_password=$VM_PASSWORD\""
fi

ansible-playbook -i hosts main.yaml $extra_params
