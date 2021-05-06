sudo cp POICA-CORE.service /etc/systemd/system
ln -s /lib/systemd/system/POICA-CORE.service /etc/systemd/system/multi-user.target.wants/POICA-CORE.service
