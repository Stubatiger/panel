from bokeh.core.properties import Any, Dict, String, Enum
from bokeh.models import LayoutDOM

from ..io.resources import bundled_files
from ..util import classproperty


class NeoVis(LayoutDOM):
    """
    A Bokeh model that wraps around an NeoVis chart and renders it
    inside a Bokeh.
    """


    __javascript_raw__ = [
        "https://rawgit.com/neo4j-contrib/neovis.js/master/dist/neovis.js"
    ]

    @classproperty
    def __javascript__(cls):
        return bundled_files(cls)

    @classproperty
    def __js_skip__(cls):
        return {
            'neovis': cls.__javascript__[0:]
        }

    __js_require__ = {
        'paths': {
            "neovis":  "https://rawgit.com/neo4j-contrib/neovis.js/master/dist/neovis"
        },
        'exports': {}
    }

    config = Dict(String, Any)
    action = Enum("None","clear", "reload", "stabilize")
    query = String()