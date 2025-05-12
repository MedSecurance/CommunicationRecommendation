import os
import signal
import time
import streamlit as st
import core.model as model
import peewee
import core.deferred_action as deferred_action
import core.global_state as global_state
import core.config as config
import ui.common as common



def show():

    with st.sidebar:
        st.markdown('![Medsecurance logo](data:image/webp;base64,UklGRtQdAABXRUJQVlA4IMgdAABQcACdASpKAY0APm0ulEYkIqIhKrfb2IANiWhu5KgejkZaBvtv+zdqBwHxn9f/cr2SrG/fv7H+s/7JwitU+U1zb/2v8F+ZXzJ/zX+z9if6C/6HuB/qZ+rvrnepb+3f8j1E/1D/O/uD70v+5/XX3hf4L1AP6Z/ev/x7X3/d9jP/F/972B/51/4fTh/dH4Vv7d/1P3a9rr//9mp0k/VX+jdq/94/LPxN/RP338qeV51p4qPtb+a/t/tg/i/9t4L/Ij/F9QL8o/iP+M/tf5A8QltH7Z+oF64/U/+V/hfGm/pPRH7J+wB/Qf69/xeOE81/2/3AfYD/Mf7R/wf8n+an00/13/y/zfn0/Pf8r/6v9N8Bn8s/r//J/wntmew39x///7rv7k//9DAzLLrwPGpshdsej5Ugkst+tkIr/pluvA7Oq7KcRe3kstX/WZ1UTmx1+/xAA1qHmvd+I91+s2R/16xCvrFfwrASumb2sB6abLQMtQkJqdfzzWh8FadgVFPtgSo3ClKeFnUhZwLl1WGVN6WdXcxtMqxRxT9tgvcHjj67+7TaF4k+qu/HkNYvC7Rs//QChRplc4/3ld8aFgK/OZr+uect1bSZUtP+I+teuKiwvnsahFPuVrkoIoFQMqovETgdfD8n4Ef+B1QO1AbcSOfCq8E2QIdSIMinntvuHw/1C1PosmzTze59Lx6LXWYQQ4sAOq8ITuBMoApqvCTXnQe8cR9rcuiNrHl+nwokcK52W2G2pLnMX4+qSkrQL3IbZSe3jiT2N/gh79sUOjoOlbggYloprKMTVYyzwrEeG2u8WbZ/Lh+jP66iH4OudLFe/srHX9Kc5z3a+xkAIYzfirt+YTryoeqvLK9u6f3zAnSY+mcMVQstt/e9D7A0EwtrTMeot3XxqhiqeSYxW2XSIkns7O4nQQt0EnQ42I3/cdpdB3zsXHj324CEDNsNr9BBR/OhRGzMENVTR9oie2DrTOS7Le9U2r2JztgEVDHlGZrO8uEQnqOIiJLsDbZtbDwgEXOGWSSZcwD7LLKiufqtO47dLfx+pCJVMJZmlADMKqZfwv1nMC4owFv1QWKM52nKiRu+s1R/vGGNu6qX1gkpmC22xneTy54Yt2HYWPV+y23DnKbGxLA53DeRzJ19Bc5taCqF0OFf/wB4RDlas5Jc8izLdeB4/ReUSE43mXMCer3x3pGlaeqnhy8cjbsAAP7/foABFFmKqFvb0MW/CczuweYguQ5YLOreyyplWt4M3wkuSTgf0JTlJYWECmA4jTL3NPJmnWS5z55QmBpDUROEPYg7D6FWRmZSc5OHH6Ls1FiYBqTTzbmJCygAaIp/XwFqUuubaCAmgkAishiCa7/GAgJ/QvsBpJFcV+YumxdjzF0JiCWzfd4k/fLEdlQyBRIwPLoL9vtbWcEV6vlJaXGvGgJ/aLbphxP/aSzu693yZ4hK1cgvJflV+J6Ry5fj28bPDbsuJcFvE18s5UGrc/l3NhFhiqHAHvPcID+snQNYAT55VoDkEW6F+ERf7Zj9+E6zFS2dmUoa2KxaSxMKl0E9K5n0Xu/FdKQaBMjLmrx/E/cCIlVOK/98NxU9qo5JSaYqmpntgBQjjOi9hpQG2auPDOXDsMQgV8HoSSFwNxh0mphgCenQxhioNDZKLz1LMjaayLbNDacJVs8mRbKVL43XE1vf+t5t89MFRHEkT4a9+5QZL+TxvAEa4V2fAUWLjgAJ0Tq/5xxKdsUMkEQ4HqiE4qQZ9P8EK4xVPGsaq5yTWf9VWBYrje1fmv6qUrESo2Fs4E11fhC27D9UjqG1r2SMOptPa689pIn6+5I/WFexpWLV2Nb3a2m2c6SRjmMcW6Rpq/fGTvRuscvQTT/IGE1At4g7OgfwCFrjChOMcXqACiIZDveS/NFQYv2vUWoiOjDwBFBqmxF6GjtQtE7HAxkbUxVkJ9a3XCYeqvBtexWi+CmXU5GDdwvAi9oOanOHG8DbmoBAdIUhO0FAVis3nP5F1ER8aJfkVqYP5K4coDzfB9L4hw1BWuJ07t8BAJxqrpX8vPmPxuYCzifKbADI+XLRXnZpkHZDqXC5FX4ItbkTaTASd4UV9QB5yYR3XKEzkl/phgApYpZPjpDREPQrNnLDPdyXQ/Hzwn7NpTMjMy3T1cG/enbsh7adG36FRvC8/UCM+EzcvyIuddE3qW/PIOSxUrkPSk0odzjYdFLbZ7x7o1yo9MT6XnS4TJTktahnJXN53bqcIJS5S8l307AJWZdsUmxPrZPHd6PUj5454Dw41/8S3/jkNiboX+K5pd1luATFv199Q0KgHAc9RXw6SoBsGwTTXOgDzBbyuwEVgpQFEtit5rsKnL79BUPPsOEWC9ApzQk78z+5vVG7GrvrC9xmdOneN1fYbpuen0my6lNaUWrx83Rf1vcET61LUExzDsr8yWZkBhig/ixenM01ayCDjT8gvCiikc1DCPHmKQct7u5G4fOljgEqnIeQ2iV5okjKK88C/w8jiuHa/dx8aqQe81W4DCADYmUzdLz1xBQQG3gqepCIOx7RPQ9B+YwLuiGObzclbc4LzjN5tKnuxvQQsYbzn3DFB7EbWf0mtvtVinOL5XK+qjk7Iq6HRXT+MmX9WMJzeeCoadkQY6d0eGW7sfT4AYrnU8zLLDq9aUt5u/13s9mEbf4sIe7KyrAj2WVv1Oz7i4PDQK+idj8XaseLfyGeE11dV32H7VYbD3hUtngu5v0MTw9DgHLMvVTyyRbz322VG71XeC194Jlb0vVLCM1iVKaLWj/9IImdDK3SUJgb6fbw2pKy/nIjaljH7gxiw/vdrTZ6loJVtxyyiYj7x5EEQTKg25B/Nh2tcVuWtudZED/lxMkJPNxc/x2V15mojUtrF2/m6FRVN7ePIxfCaAB2l0//NKt+gg1eHjiKh+vasMJkCT5P/7s9gAurpgYuhcG+znMQcMrnwiWQY8yLsBG99gfaNeTHvcnOgxW82yoe4qFyzfyXFw4mpFnvywujuUKI7W+ZjpTcTykVw0RJesVvTTC0duElhHu5ZwAus1LOGznvo2zhPhByeIHArTIS2/vfbI0eHJ+kWHPOnB633apb6IlcJORBNka6LXAqjcVlYLWv7rIAGXMDugWtAEHLCsdKRzWYtAMu6lGMcQAPXyLUqo3+6o+8UrI9UJojekjvdTSn6KksXUUmtokQkoDrSORq0WoR1B59b55pzXHg2GYdV2fQoRkj+bL5oh3/XimYvbyik6AhHKL95qZiT8SbzAQhwhhAJoojQ3OuiF+gcl69L8L1tNCjIOcW16rkbtWuu3iV4gHhvWWfA7InsKy1nDRXD7AAzbq+8ZK4g18/gk/aD8//YfPfoWtZHnMtd3h7M7qfRwOIcn7zKF+dtgSmQvGpMWPSEiM/4uW9muIfDeanL6o7lL4oITxzBI9AD4Zg4lDilvQng6AootEULTnoIy1LBm7pp1Fj2ofYuzpqrPYS2vERTNgMlKTSg1IQymZ9KAabyxEmNjSlNjyxMCBUBK0pqCIUN/EcUEKvKlcaVyvSuNLPtC/5nCEJh4jS0OHkgEFApXhQMH/f3Dwwy58DqTBHcKQxkrGuLe1z7Xv7bs7gqNLzqX0KHdzmot7LGbRFQ7mFTQYlmm2JfXU/+anclT7ajUgoYeqiUsk6FgvFNNACLnlbsAEvSq9VzasjId9H/pHhstH4rVg3D2BCi3bFP4WbbGrup5LDbz+hoLFcKqIAk/MUj/n4jpCm934bqEkgcIW88EFj2ROi5734Z3g3upjl82s2BkwQFrxtNx8/pW0eRQSHD0xQE+SYXTMS5nRsBIGKPNtIUu+EW2M6hZYDeGTFl1CpuNN5tP1sJ6YJ6k/10WX1V9TwQHI7oM4SglHkGKuFg6RpzxQrU3YKE+AJ5iKehldu3tgdccmC5vh/atNz038ZK/skM6hoKMDbj1tIKng9P26Xq4O7KrcnnxIh+8DemzIXY8o1TmUllD5A/aB4hxb3nKW7xwHKNii05U6iVxRBZHM0uof6+vMmCcVMEd2kCxXsjpTd16n5o9VcK30OlGQrnf8gIB8emYHGwPeKSCxLUnZlclVKaw6obEG0wvgfgQurgrGaAxTfheXsJcghyk/LZwCAGx9BNAJrKZKiZ9pZPAfisEi1YyiqnfnjHgK8HjariOneaU62hJgGoel9rZnrqAwm/kelEw21VDNZU/zMfNSJA3+eK7mdw/KRH4xUCDg0DRNiBGlJtMXhljE+TSywifaKO5y5iO0nb/BwxYJ6cyOs1Ib6XI5AVuByVlIjgZ3LIyxlleZNsdCfMDmnaLC4T9hBvyqrMqlOgA7pBQ6wBN0grx9s1pwjxgXuNyHSDIvPOrxDxaaC6l7iytp1GvZvBRBhybLGQdQK8VsPII7+eAdLqcoO9Vyy/KIkOC8QzPH2XLd2OlGHHOkWG93DRaJqu3BAtqTZvqUvOzELNUVQveKoHM7O05Bkno1zzw8OxBiLyWj9mwxhxSEpjf8Ezu8yAjhwK+nl2K4ImesrRcoYfGV7aQqrOiRnIMcymmfA3ryXzedvyz4VdWrBCaMvrWTO8RNnRoFSl5c3mPrW1sk6WSPsfnJgdqVkMYoKdbKztCMCFmQQGBbLSltvtJb/9KHuvRqQ93AA3eTcDpze7ZbiIIZI6EqCf0UN4+Drc1j9x/Ut9CitoDRW3gwiS8rc0gt3tnq1mwzDcYqBG4flV8GU3y8xagidXyt8Ot4Kd/9ZcQe616UXIX6JxLnoaeZQadVmq+RP5W8wwWgu6FzJ831VP3TkFjPNWsKi1tmMFDtbBI9KF7kDJWH6gx/PH0qjF2JZhn90K2w4Eje4noSaWe4+tObtrhkunO5kt99mbXDRzCtXAnVUSlsDDOE23Mxsf/LWj/WcQu2SnfQiDCqGlYgmKudA5iVos6+o+j4mcpC+wiKuj9bq8x2ap/Vd2mdYzUGYshyF5dkUOuIFouFif5MGS4ygvauGrc8h9Vg7pCrwObMBqrL/IkhnLTgFGcDZt9FyaId1d6JmRIKx6yOmDSKO5qOXkvOPfPt3xfphxiQOR+iG4hYDi2jHB90g6t0hTlkio9FlORUM+ARxdZo4H3hCqFaTIUZBMp4y9XwYezAjM6slNSRNiraL01xQVZ8WJ5ZKr5mqSUoEcRwimJNy0VFIL0KrtDEKw1n6NWjW8+KaIkKvt4FQlgD4+jvsDtFQoFBGYjS+prZwB87rX0cmwIGBHuMzjwxxNMQW9Zz+BZcmcfGSwzfmqGYW53g1C2K5pbeT80ZBHKWjvT1ZaUgA02QgX7pS7lO0UzcC1fdNkYqK8xdexYOUqw3P9Qs7mWkB+BLe4+Xoiif1xhMaKT6xdYQg89QEukpfW7E+Wf/o+fh1TUoYwTpOu01K51Ianbu/BFh4/vLALnvNRTz6TuYIpy0l5szwn98oqgpplOeDwWPLPfJnO3OZlK5ilyFtuXfjZhxa2l3wKLUqLt+2H/Wj231q3WeBmyDPKenBl/4Q+uLPQST5imgiwI6nJg2CqmJGs6nDRIUhnHbAXzGu8BxrcGHsSZLcv5Yn7EievT8CLXv2g8QQSwBoIkRCfwpt66J5Qvyudu+HSwPp60EEgo4kvpSaLMmsGqmdw9BAvH+dXEtgXi4kqq3ge3+AukY9ZM7ZfDMziMhRf1meBxVdPJ4WTezmSuKyQMtjDbq7S74alVcYKuSNIuxfeeEUAANEJ2C/DAfcrtB3S2A6F/NZuWYwirIN/wyL5aiVU9LwHOkDxgoBuwy+4GcOHp4RWfClrOkyfrwA2fuYwVebuemuFS5//bJMK6rC3x62F8b/tC21vwcjOS8HgUInSJw4YTur9U2YQK0+M9M1pNPLIyjrJuFjv8hXvCcJb92vV/MjALQOPUPN3x2rfJxG9zBCFa5C/R+vxKfhD6T8Of7bl1CvMOZ3CR+bmwUn/F6sa2ck71zJM0Cr+Alv3aX64Xmi5y77S0wQKFKMA4w3GASaz4UO8y53cNxz7n+nzt4JRfjN+paqyS6uwwgguyVfR46daNM+LeQfTsmVMf1GlfcCxQ5GCfK+4FruH0UFFUjBT4oTrWCE/961qXao1kRWN2enTb9rIJEcAd1PaswyZx2k3l9BapG7ObLXlv+oH566BxYuTiNyiJ6IlJBH1vn4Ty4TkPBXJf2vXoM+U6hjp5qjS/gmnUi6DQeHiqRbZ5oAhVm0d6mYwTvdqd7dth6xaGnrtmEg9jVsYa5NR54UNWERpfRrlMIlAsMPJ02NA9VtJtfGOVtwStNA8HJPH3nnILcneIW+jidK1vn97/hn5k+V/f8NrDww39OUu0r8Md5vvHITKCVqf5OBOi0H58ruqdjLyFDGMKP16xWmeRbiX/wO+3Oslfg6bqkr9c8RIxJ88EpNsgDjWB7zF3mbXial46T8stXPO7/mvrWEg2+TRU9634V8Gre3/FKAh2pJ4zdUDO+BXI6+ekj9uYphrO8lfv0lGIPtaApwAg1BkPBOFhGBw75V0+lcKY8VfopQfTELSnR0aLsNhnOHC2nGJClooIwK8e6tfnHeBohgGch2brca3uG2r7v8jURBRqxmsvMwI5yn2CGOLdKciUsEcOnl362jRt+bwa9CduxwAil/N9FcQ8IfYhXflDE3mF3nOGPTz8zWol4pkAYBIj2h+FYVjnnkYAPcvHuPrLdJ5tNqSpsMWFweI8zIVfFgSOP3Oqv2Nhw0mq2zqThSR1ohDCKTUAkyKxGgQsLzOzHCpSJOLDfeVa6qW8Xpb9fofiCORc8Imz9eT1/3tGLCrzFasQddwknnb1uVKHRypmeTaLYHuj9EmbXeQMlrz+HUkwUcIMW1shyuFGBIwmocj7cxOzUfH++20AvLn/S4PY0AO+vTevo20CQic8YeagjGanTlIRrMYE0Ns1HhnlYtjFziZAoiQfoVZA9r34l6HS90/jomCoz70WL63R4hSzWI5u2OKo61s7Hs7xF6mVBkTQGuSbTmQw0k/OSIbvnpv9+4sU0BVfnB/c9At5kEJHyxJN6VgBRey1W/fHLTGJ0luRmjPT9o5CWEsVW8IqeKyjm2m7cjcDVENRVDlnMzmxgDTTnVMid1qArtYkJCzyhRVx98SA/9RpnhprRB3aHyi+yD9OD0FK788tWjOEpxGS1u7N9PNZNIRY7aFiYqrjmVhI7A/XDHKGBLDPxJpwmyTl1Z4tcM4B2vZLqX072UZAO8bMrlWHkRMlcTPL2nr6WWlFja3obixk07UGtxaLL0i/GvUDb5JHwpJzmtYOhojOfzGCtw2Em28tSpLbLSWIqs2VQWyK++dq7UnZZ782gN0s3S4H6YoaxxagkXTktzdLDj2bwUAq8on/OyYxVahZZe8LZiPvJkZDafblHAmSyuho1YwGdnGS3patc8i7/E5+urOlp7u26ka43APJsmnVqvQL9kJe263QTYtNcxzulgmEbF1i0o2vQM23eS90qoL3GA6C5TR+B+uGGmhGnyAafc12rnSFjYvuwsPN9YaJ7gDepYm3Zt1A4320FruQcAjuiEjP7FuWtuqZN0A9ZgowvHGD0T1v4tEZjdNRi4VzKm8vJ603yVCAKmiQd2HY8Sc1clM03arjj4urhin9/qGuTklG9kmA6kA1KKI7xUizsI2Dx0ps0pHkzVdo4XOSZMrob9HL1tU+00SU4JSdvjJcQWfXA+Hb4DHS1Lun/gv3p3V+eeUOH1sea5FXrWEp50Dp0otIpX5hZJici/QyzQzzc1XuFhJFn/thY6Bp5bw7ZkOTmIKbFOOgkr2p3Bwf36Dv730+Rw+U24pOMLxr7Ca6Qe/swr61m05SZss7eaiNnpocRRTpCXUTcVD3u6S0isaJ8500yYNPwq/buQUuXA7bIPxy/HJM3BuGu4ufPHZCSns0vFbShX0Khz61bHIod15z9HGStG8SOcOTfR1WxR/W8ro6I0TwsLjvZv12ZEWAvPLfvhnkY8iHaxUFQVOURDfJGUsbX2QmQqw9bfI9suM0jtAMf/TNY9HkcWSu+3wgNeekTQfSn8ReJcm53oN1yOp/Y/Bp29ItXe5GuimCz+C38Rsdml576j0Rkq2y53AuBALPhxv8AsAoBT3BttHL3Du1XdpnRGxZGcL2zqzpCT/NkkXtG2YONp39q/vgYuOMoPy1STz/AhRpEroe/AcbM2IEVfNHktBk8bO2FFqBFTkjpVXcCIXj9WX3YZuaUJ8VO2ubmyH14wfwWdgd/Ihxihw753+tGhPtbb2OxKMK3zfqd3eJ5JdjKjx1Gy9f02RSN+OxyN+E7dSXyzFVZTrOWotaLTl6Q+UdCgiDljqeJm3Px3D/jdsinBKnTYjB1oHwAMpKlA3qibn7B0eCRAkzv5Mjzh4Yw4qfz1RbbXUO4/9bardLeofmSSa9mjinop7Kx15cuoFNgqRfnpSKVJ7GPj1zeh/7qmJ22QEsbI3tKTM25hQQcZsO0yhvRtSy2phnvQWU8xyK76wY7va2q087OFC23zDp0HhOewZt6IYxk2Ph7RJ2h0LBJ+15KExfa1LzZN47U2yJ7XuABX1Shk3z5iX5fNCVJ/QZbakwWhXBbCzzAVvwvTRpIhmyt0JmVPYMkrcZGOiYy40H4AgehrcTwgwI+wcf82sT3IRKITXvbfrwZfpCSGcnOywVV1Vghxe6BmP1YHsS14tyT/MkLxC4KLUu8xw0zRlTi3MxZatJZYd1bXBwdqOQkxvJ8ewnrf1jtf/mdgbG7KdI1BIulR/TyWf7/o+r8dpwgtfPceVWJj2rr+n0hhHLjxNRINmzeEABhzZvEeCoHd+ycaEe4ONWCrOEuCxy8xXE/n5X9c/s5vI/2Jbyr0mWL9G1p46vG8lRsZPTWVdzAITjDeGfOoJsIuC9vp8B17I3p08qSb717ia7FSw0Wrfa3Dvbly3gc0l0AUjQ92H+bgTgNtq5QL7BTpeMq+5mlgtp+FBvXbGXyDBjGadskAeJqCHunir9HMuS3NiOyQkU1KWk2CUiJgDNMxyWTEUFg1HLCMuGJ9AYeemEP6RwGkQxZibQ21TgNW7g/uBMJ5ns52aCbAV/NhzZxgVEg4AZrzod+4abi+FnvwyV9q/Rnf21+cddRadpvVG/xQfMlMHCMpdboSuDewpt22/5X60CWFxuvvByr+5O+VZ09xLhtusW6vuXNglpG9haHg3upzSR03U6+jBPM2d+wWnVBk6oU9V7oMguTdjN7TZ/eTxXXcyE2Ul9YGLub77rsw17RBDjWN6Ylayg0I9lNPLQAIeSxOGKjw30/JMKMBIHYF1qO342SgztOV9f5PVedvifgQz2geFjGhi3UrBWEcIDAHurieIfpS8uytEhkFhNWM3ASQHBg7aRaFEU5IfAtYAfWDNkAN2Fp8jQgalMDUyg2efErCrfvRSrGbZkrJm3Ig4AP0qcTB7rf5LxfgcKwkK0Qz6lRvv4UTC6MzFXsICnvOXIGbEjNDR2FQ4ltyQ3rmCCw6yeVZNUvHuQtLORxEIcpeEcvczaR9xRWPw1ZgfbelAT/Ydl0uZdXsyyQijYObQQewmfwKGqqRD9lWSVy7WHVXNIMsyrl5zs/DbRlctEsL8hpdn99Xv4Lf25Y2BPROpzxLwVmI0S1vyx0di4E4FPbWbrAVsK4uFFZyhHD5UbCRXDTTjq+hLJ7w2QVtiGbX/Up4xQzth96X8CoA0ZKFF5RoKtNhenjDQV/kUdB7G2f05uxEa8BZw6tdYa0HSWBIg9d65qTwHvZE2eFsO+/mAPRXSfxgNlykodEXPvSDpm7Y/q62fBYnepkFOX6XgLGlrjr/fAde3OjieppSzM1wihDBtEakwmo4+/0JgryiTlCQEiAj6e5oAH8PIUP6GNwND/GuF7Uwbq+WyhuZzxVzVSLGaCCa3BvagJ+3xHXMguMK/E+IkUT68CU6AAAAJcY/WamBqJhZpTtlzLfGq6TuY4qmYUmpvMomw1dB0Yi4NoN8vI97QOSCAZEaf8VXUuAdHZRMxMRBgcflvlulsOtyC0aVEQTbxeMJgyNi2XmYC0bl4G3STEholYOiMi2JS3G9Lr52zD7+8+PBMTnkQzkahtY/IyfCNOZnYwDThRwYJSps95IW9dJmXFHx6bhJkfn6uAbawtKoiXoWuiZZ+6WDAvNGHGrPyzOxjZU5ST3b8SjNHe58AAAA)')
        st.markdown('## 🔎 IoT Inspector')

        # Show a checkbox to show whether we are inspecting traffic or not
        with global_state.global_state_lock:
            st.session_state['should_inspect_traffic'] = global_state.is_inspecting

        st.checkbox(
            'Inspect Traffic',
            key='should_inspect_traffic',
            help='If unchecked, Inspector will temporarily suspends traffic inspection',
            on_change=set_inspect_traffic_checkbox_callback,
        )

        # If any of the rename boxes are visible, stop auto-freshing
        auto_refresh = True
        for (k, v) in st.session_state.items():
            if k.startswith('rename_box_visibility_') and v:
                auto_refresh = False
                break

        # Show a checkbox to enable auto-refreshing for at most five minutes
        auto_refresh = st.checkbox(
            'Auto Refresh',
            value=auto_refresh,
            help='If checked, Inspector will automatically refresh the page every 2 seconds for up to five minutes.',
            key='page_auto_refresh'
        )

        try:
            upload_Mbps, download_Mbps = deferred_action.execute(
                func=get_overall_bandwidth_consumption,
                ttl=5
            )
        except deferred_action.NoResultYet:
            upload_Mbps = 0
            download_Mbps = 0

        upload_Mbps = common.get_human_readable_byte_count(upload_Mbps * 1000000, bitrate=True)
        download_Mbps = common.get_human_readable_byte_count(download_Mbps * 1000000, bitrate=True)

        st.markdown('## 📊 Overall Statistics\n' +
                   f' * Inspected devices: {get_inspected_device_count()}\n' +
                   f' * Overall upload: {download_Mbps}\n' +
                   f' * Overall download: {upload_Mbps}')


        st.divider()

        st.button(
            'Quit IoT Inspector',
            use_container_width=True,
            on_click=confirm_quit
        )


def set_donate_checkbox_callback():

    should_donate_data = st.session_state['should_donate_data']
    config.set('should_donate_data', should_donate_data)

    # Show the consent in the refresh
    if should_donate_data:
        config.set('has_consented_to_data_donation', 'not_set')
    else:
        config.set('donation_start_ts', 0)



@st.cache_data(ttl=2, show_spinner=False)
def get_inspected_device_count():
    """Count the number of inspected devices."""

    with model.db:
        return model.Device.select().where(model.Device.is_inspected == 1).count()



def get_overall_bandwidth_consumption(time_window=10):
    """Returns the overall bandwidth consumption in Mbps."""

    upload_Mbps = 0
    download_Mbps = 0

    with model.db:

        max_ts = int(time.time())

        upload_bytes = model.Flow.select(
            peewee.fn.Sum(model.Flow.byte_count)
            ).where(
                (model.Flow.src_device_mac_addr != '') &
                (model.Flow.dst_device_mac_addr == '') &
                (model.Flow.end_ts > max_ts - time_window)
            ).scalar()

        download_bytes = model.Flow.select(
            peewee.fn.Sum(model.Flow.byte_count)
            ).where(
                (model.Flow.dst_device_mac_addr != '') &
                (model.Flow.src_device_mac_addr == '') &
                (model.Flow.end_ts > max_ts - time_window)
            ).scalar()

    if upload_bytes:
        upload_Mbps = upload_bytes * 8.0 / 1000000.0 / time_window
    if download_bytes:
        download_Mbps = download_bytes * 8.0 / 1000000.0 / time_window

    return (upload_Mbps, download_Mbps)



def set_inspect_traffic_checkbox_callback():

    with global_state.global_state_lock:
        global_state.is_inspecting = st.session_state['should_inspect_traffic']



def confirm_quit():

    st.markdown('### Are you sure to quit IoT Inspector?')

    c1, c2 = st.columns(2)

    with c1:
        st.button('Yes', on_click=quit, use_container_width=True)

    with c2:
        st.button('No', use_container_width=True)

    st.stop()



def quit():
    """ Stop the Streamlit server"""

    st.markdown('## 🔎 IoT Inspector has terminated.')
    st.markdown('Feel free to close this window or relaunch IoT Inspector.')

    time.sleep(5)

    # Get the current process ID
    pid = os.getpid()

    # Kill the process
    os.kill(pid, signal.SIGTERM)

    st.stop()