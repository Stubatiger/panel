import param

from pyviz_comms import JupyterComm

from ..util import lazy_load
from .base import PaneBase


class NeoVis(PaneBase):

    config = param.Dict(default={}, doc="""The Neovis config being wrapped""")
    action = param.Selector(default="None", objects=["None", "clear", "reload", "stabilize"])
    query = param.String()

    _updates = True
    priority = None

    @classmethod
    def applies(cls, obj, **params):
        if isinstance(obj, dict):
            return 0
        return None

    def _get_model(self, doc, root=None, parent=None, comm=None):

        NeoVisPlot = lazy_load('panel.models.neovis', 'NeoVis', isinstance(comm, JupyterComm))
        props = {'config': dict(self.object)} if isinstance(object, dict) else {}
        props.update(self._process_param_change(self._init_params()))

        model = NeoVisPlot(**props)
        root = root or model

        self._models[root.ref['id']] = (model, parent)

        return model


