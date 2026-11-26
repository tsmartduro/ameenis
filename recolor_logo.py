"""Recolor the logo PNGs by shifting hue. Usage: python3 recolor_logo.py [degrees]
Blue (~220) + 45 deg -> violet (~265). Run on the ORIGINAL pngs; keeps white/black/grey untouched."""
import sys, numpy as np
from PIL import Image
SHIFT=float(sys.argv[1]) if len(sys.argv)>1 else 45
for f in ['logo-mark.png','logo-full.png','icon-192.png','icon-512.png']:
    im=Image.open(f).convert('RGB'); a=np.asarray(im).astype(float)/255
    r,g,b=a[...,0],a[...,1],a[...,2]; mx=a.max(-1); mn=a.min(-1); d=mx-mn
    h=np.zeros_like(mx); m=d>1e-6
    rc=np.where(m&(mx==r),((g-b)/np.where(m,d,1))%6,0)
    gc=np.where(m&(mx==g)&(mx!=r),(b-r)/np.where(m,d,1)+2,0)
    bc=np.where(m&(mx==b)&(mx!=r)&(mx!=g),(r-g)/np.where(m,d,1)+4,0)
    h=(rc+gc+bc)*60; s=np.where(mx>0,d/np.where(mx>0,mx,1),0); v=mx
    h2=np.where(s>0.15,(h+SHIFT)%360,h)
    c=v*s; x=c*(1-abs((h2/60)%2-1)); mm=v-c; z=np.zeros_like(c)
    sec=(h2//60).astype(int)%6
    R=np.choose(sec,[c,x,z,z,x,c])+mm; G=np.choose(sec,[x,c,c,x,z,z])+mm; B=np.choose(sec,[z,z,x,c,c,x])+mm
    Image.fromarray((np.stack([R,G,B],-1)*255).round().astype('uint8')).save(f,optimize=True)
    print('recolored',f)
